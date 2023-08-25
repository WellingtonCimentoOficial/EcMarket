from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CategoryProduct
from .serializers import CategoryProductSerializer
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
from products.models import ProductFather
from .utils import apply_category_filters

# Create your views here.
class CategoriesPagination(LimitOffsetPagination):
    PAGE_SIZE = 5
    default_limit = 5
    max_limit = 100

@api_view(['GET'])
def get_categories(request):
    try:
        random_param = request.query_params.get('random')
        min_product_count_param = request.query_params.get('min_product_count')
        max_product_count_param = request.query_params.get('max_product_count')

        # applying filters
        categories = apply_category_filters(
            productfather_instance=ProductFather, 
            categoryproduct_instance=CategoryProduct, 
            min_product_count_param=min_product_count_param, 
            max_product_count_param=max_product_count_param, 
            random_param=random_param
        )
        
        #making a pagination
        paginator = CategoriesPagination()
        paginated_categories = paginator.paginate_queryset(categories, request)

        #serializing
        serializer = CategoryProductSerializer(paginated_categories, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_category(request, pk):
    try:
        categories = CategoryProduct.objects.get(id=pk)
        serializer = CategoryProductSerializer(categories, many=False, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_categories_name(request):
    try:
        search_param = request.query_params.get('search')
        random_param = request.query_params.get('random')

        # applying filters
        categories = apply_category_filters(
            productfather_instance=ProductFather, 
            categoryproduct_instance=CategoryProduct,
            search_param=search_param,
            random_param=random_param
        ).values_list('name', 'id')

        categories_formatted = [{'id': id, 'name': str(name)} for name, id in categories]

        #making a pagination
        paginator = CategoriesPagination()
        paginated_comments = paginator.paginate_queryset(categories_formatted, request)

        if len(categories_formatted) > 0:
            return paginator.get_paginated_response(paginated_comments)
        
        return Response(status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)