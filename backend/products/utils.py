from django.db.models import Avg, Q, Value, DecimalField, F, ExpressionWrapper
from django.db.models.functions import Coalesce
from .exceptions import ProductFilterError
from uuid import uuid4
from .models import ProductChild
import re

def apply_product_filters(productfather_instance, request):
    search = request.query_params.get('search')
    random = request.query_params.get('random')
    rating = request.query_params.get('rating')
    relevance = request.query_params.get('relevance')
    categories = request.query_params.get('categories')
    brands = request.query_params.get('brands')
    min_price = request.query_params.get('minPrice')
    max_price = request.query_params.get('maxPrice')
    
    # verifing if search param exists and if his value is true 
    if search is not None:
        keywords = re.sub(r'[^A-Za-z0-9\s]+', '', search).split()
        if len(keywords) >= 2:
            query = Q(name__icontains=keywords[0])

            for keyword in keywords[1:]:
                query &= Q(name__icontains=keyword)

            products = productfather_instance.objects.filter(query).all()
        else:
            products = productfather_instance.objects.filter(Q(name__icontains=search)).all()
    else:
        products = productfather_instance.objects.all()


    # filtering by categories
    if categories is not None and categories != "":
        if categories.replace(',', '').isdigit():
            category_ids = [int(item) for item in categories.split(',')]
            products = products.filter(categories__id__in=category_ids).distinct()
        else:
            raise ProductFilterError()
    
    # filtering by brands
    if brands is not None and brands != "":
        if brands.replace(',', '').isdigit():
            brand_ids = [int(item) for item in brands.split(',')]
            products = products.filter(brand__id__in=brand_ids).distinct()
        else:
            raise ProductFilterError()

    # filtering by rating
    if rating is not None and rating.isdigit():
        if int(rating) > 0 and int(rating) <= 5:
            products = products.annotate(average_rating=Avg('comments__rating'))
            products = products.filter(Q(average_rating__gte=int(rating)))
        else:
            raise ProductFilterError()

    # filtering by relevance
    if relevance is not None and relevance.isdigit():
        if int(relevance) == 0:
            if hasattr(products.first(), 'average_rating'):
                products = products.order_by('-average_rating')
            else:
                products = products.annotate(average_rating=Coalesce(Avg('comments__rating'), Value(0.0, output_field=DecimalField()))).order_by('-average_rating')
        elif int(relevance) == 1:
            # products = products.annotate(ordering_price=Coalesce('discount_price', 'default_price')).order_by('-ordering_price')
            if hasattr(products.first(), 'average_rating'):
                products = products.order_by('-average_rating')
            else:
                products = products.annotate(average_rating=Coalesce(Avg('comments__rating'), Value(0.0, output_field=DecimalField()))).order_by('-average_rating')
        elif int(relevance) == 2:
            # products = products.annotate(ordering_price=Coalesce('discount_price', 'default_price')).order_by('ordering_price')
            if hasattr(products.first(), 'average_rating'):
                products = products.order_by('-average_rating')
            else:
                products = products.annotate(average_rating=Coalesce(Avg('comments__rating'), Value(0.0, output_field=DecimalField()))).order_by('-average_rating')
        else:
            raise ProductFilterError()
        
    # filtering by price
    if min_price is not None and max_price is not None:
        if min_price.replace('.', '').replace(',', '').isdigit() and max_price.replace('.', '').replace(',', '').isdigit():
            product_to_filter_ids = []
            for product in products:
                if product.has_variations:
                    variant_ids = list(product.variants.values_list("id", flat=True))
                    childs = ProductChild.objects.filter(product_variant__id__in=variant_ids, quantity__gte=1).distinct()
                    if childs.annotate(price_to_filter=Coalesce("discount_price", "default_price")).filter(price_to_filter__range=(float(min_price), float(max_price))).exists():
                        product_to_filter_ids.append(product.id)
                elif (product.discount_price or product.default_price) >= float(min_price) and (product.discount_price or product.default_price) <= float(max_price):
                    product_to_filter_ids.append(product.id)
            products = products.filter(id__in=product_to_filter_ids)
        else:
            raise ProductFilterError()
        
    # verifing if random param is true and then organizing
    if random is not None and random.lower() == 'true':
        products = products.order_by('?')
    elif not hasattr(products.first(), 'average_rating') and not hasattr(products.first(), 'ordering_price'):
        products = products.order_by('-id')
    
    return products


def mount_product_filters(products_query_set, categories_query_set, brands_query_set):
    categories_data = {
        "id": uuid4(),
        "name": "Categorias",
        "param": "categories",
        "data": []
    }
    brands_data = {
        "id": uuid4(),
        "name": "Marcas",
        "param": "brands",
        "data": []
    }

    for category in categories_query_set:
        categories_data['data'].append({
            "id": category.id,
            "name": category.name,
            "count": products_query_set.filter(categories__id=category.id).count()
        })

    for brand in brands_query_set:
        brands_data['data'].append({
            "id": brand.id,
            "name": brand.name,
            "count": products_query_set.filter(brand__id=brand.id).count()
        })
    
    return [brands_data, categories_data]