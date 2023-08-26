from .models import ProductFather
from .serializers import ProductFatherMinimalSerializer, ProductFatherDetailSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Q
from rest_framework.pagination import LimitOffsetPagination
from .utils import apply_product_filters, mount_product_filters
from brands.models import ProductBrand
from categories.models import CategoryProduct

# Create your views here.
class ProductsPagination(LimitOffsetPagination):
    PAGE_SIZE = 5
    default_limit = 5
    max_limit = 100

    def get_paginated_response(self, data):
        return Response({
            'total_item_count': self.count,
            'total_page_count': self.count // self.limit + (1 if self.count % self.limit else 0),
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


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
        paginator = ProductsPagination()
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
            products = ProductFather.objects.filter(Q(name__icontains=search)).order_by('?').values_list('id', 'name')
        else:
            products = ProductFather.objects.values_list('name', 'id')

        products_formatted = [{'id': id, 'name': str(name)} for id, name in products]

        #making a pagination
        paginator = ProductsPagination()
        paginated_comments = paginator.paginate_queryset(products_formatted, request)

        if len(products_formatted) > 0:
            return paginator.get_paginated_response(paginated_comments)
        
        return Response(status=status.HTTP_404_NOT_FOUND)
    except:
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