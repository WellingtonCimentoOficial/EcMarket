from .models import ProductFather
from .serializers import ProductFatherMinimalSerializer, ProductFatherDetailSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Q
from .utils import apply_product_filters, mount_product_filters
from brands.models import ProductBrand
from categories.models import CategoryProduct
from utils.custom_pagination import CustomPagination
from utils.shipping_info import Correios
import os
import re

# Create your views here.
@api_view(['GET'])
def get_products(request):
    try:
        search = request.query_params.get('search')
        random = request.query_params.get('random')
        rating = request.query_params.get('rating')
        relevance = request.query_params.get('relevance')
        categories = request.query_params.get('categories')
        brands = request.query_params.get('brands')
        min_price = request.query_params.get('minPrice')
        max_price = request.query_params.get('maxPrice')

        #applying some filters
        products = apply_product_filters(
            ProductFather, 
            search=search, 
            random=random, 
            rating=rating, 
            relevance=relevance, 
            categories=categories, 
            brands=brands, 
            min_price=min_price, 
            max_price=max_price
        )
        
        #making a pagination
        paginator = CustomPagination()
        paginated_products = paginator.paginate_queryset(products, request)

        serializer = ProductFatherMinimalSerializer(paginated_products, many=True, context={'request': request})
        
        #returning 404 if no product is found
        if products.count() == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_products_name(request):
    try:
        search = request.query_params.get('search')

        if search is not None:
            keywords = re.sub(r'[^A-Za-z0-9\s]+', '', search).split()
            
            if len(keywords) >= 2:
                query = Q(name__icontains=keywords[0])

                for keyword in keywords[1:]:
                    query &= Q(name__icontains=keyword)

                products = ProductFather.objects.filter(query).order_by('?').values_list('id', 'name')
            else:
                products = ProductFather.objects.filter(Q(name__icontains=search)).order_by('?').values_list('id', 'name')
        else:
            products = ProductFather.objects.values_list('name', 'id')

        products_formatted = [{'id': id, 'name': str(name)} for id, name in products]

        #making a pagination
        paginator = CustomPagination()
        paginated_comments = paginator.paginate_queryset(products_formatted, request)

        if len(products_formatted) > 0:
            return paginator.get_paginated_response(paginated_comments)
        
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = ProductFather.objects.get(id=pk)
        serializer = ProductFatherDetailSerializer(product, many=False, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET']) 
def get_product_filters(request):
    try:
        categories = CategoryProduct.objects.all()
        brands = ProductBrand.objects.all()

        filters_data = mount_product_filters(categories_query_set=categories, brands_query_set=brands)

        return Response(filters_data)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_product_delivery(request, pk, zip_code):
    try:
        # filtering for a product that has the same id as pk
        product = ProductFather.objects.filter(id=pk).first()

        # getting a params sended by frontend
        destination_zip_code = zip_code

        # initializing the correios class
        correios = Correios(username=os.getenv('CORREIOS_USERNAME'), APItoken=os.getenv('CORREIOS_TOKEN'))

        # checking if the product exists
        if not product:
            return Response({'error': 'The product is invalid'}, status=status.HTTP_400_BAD_REQUEST)
        
        # getting the store's zip code and removing all characters that are not numbers
        source_zip_code = re.sub(r'\D', '', product.store.address.zip_code)

        # checking if store zip code is valid
        if not correios.validate_zip_code(source_zip_code):
            return Response({'error': 'The source zip code is invalid'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # checking if destination zip code is valid
        if not correios.validate_zip_code(destination_zip_code):
            return Response({'error': 'The zip code is invalid'}, status=status.HTTP_400_BAD_REQUEST)

        # getting a correios token
        token = correios.get_token()

        # getting a delivery price informations
        price = correios.get_delivery_price(
            token=token,
            source_zip_code=source_zip_code,
            destination_zip_code=destination_zip_code,
            obj_weight=product.weight,
            obj_width=product.width,
            obj_height=product.height,
            obj_length=product.length,
        )

        # getting a delivery time informations
        time = correios.get_delivery_time(
            token=token,
            source_zip_code=source_zip_code,
            destination_zip_code=destination_zip_code
        )

        # checking if token, price and time are valid and then returning a response
        if token and price and time:
            data = {
                'company': 'Correios',
                'delivery_time': time.get('prazoEntrega'),
                'max_date': time.get('dataMaxima'),
                'home_delivery': time.get('entregaDomiciliar'),
                'saturday_delivery': time.get('entregaSabado'),
                'price': float(str(price.get('pcFinal')).replace(',', '.'))
            }
            return Response(data)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)