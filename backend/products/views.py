from .models import ProductFather
from .serializers import ProductFatherMinimalSerializer, ProductFatherDetailSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Q
from rest_framework.pagination import LimitOffsetPagination

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

        # verifing if search param exists and if his value is true 
        if search is not None:
            products = ProductFather.objects.filter(Q(name__icontains=search)).all()
        else:
            products = ProductFather.objects.all()


        # verifing if random param is true and then organizing
        if random is not None and random.lower() == 'true':
            products = products.order_by('?')
        else:
            products = products.order_by('-id')
        
        #making a pagination
        paginator = ProductsPagination()
        paginated_products = paginator.paginate_queryset(products, request)

        serializer = ProductFatherMinimalSerializer(paginated_products, many=True, context={'request': request})
        
        return paginator.get_paginated_response(serializer.data)
    except:
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
        product_father = ProductFather
        products = product_father.objects.get(id=pk)
        serializer = ProductFatherDetailSerializer(products, many=False, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)