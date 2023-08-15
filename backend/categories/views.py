from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CategoryProduct
from .serializers import CategoryProductSerializer
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
from django.db.models import Q

# Create your views here.
class CategoriesPagination(LimitOffsetPagination):
    PAGE_SIZE = 5
    default_limit = 5
    max_limit = 100

@api_view(['GET'])
def get_categories(request):
    try:
        random_param = request.query_params.get('random')

        if random_param is not None and random_param.lower() == 'true':
            categories = CategoryProduct.objects.all().order_by('?')
        else:
            categories = CategoryProduct.objects.all().order_by('-id')
        
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
        search = request.query_params.get('search')

        if search is not None:
            categories = CategoryProduct.objects.filter(Q(name__icontains=search)).order_by('?').values_list('id', 'name')
        else:
            categories = CategoryProduct.objects.values_list('name', 'id')

        categories_formatted = [{'id': id, 'name': str(name)} for id, name in categories]

        #making a pagination
        paginator = CategoriesPagination()
        paginated_comments = paginator.paginate_queryset(categories_formatted, request)

        if len(categories_formatted) > 0:
            return paginator.get_paginated_response(paginated_comments)
        
        return Response(status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)