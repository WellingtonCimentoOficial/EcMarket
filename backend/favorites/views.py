from django.shortcuts import render
from .serializers import FavoriteSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from products.models import ProductFather, ProductChild
from products.exceptions import ProductFatherNotFoundError, ProductChildNotFoundError

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites(request):
    try:
        favorite = request.user.favorite
        serializer = FavoriteSerializer(favorite, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_favorites(request, pk):
    try:
        child_param = request.data.get('childId')
        product_father = ProductFather.objects.filter(id=pk).first()
        product_child = ProductChild.objects.filter(id=child_param).first()

        if not child_param and product_father is None:
            raise ProductFatherNotFoundError()
        
        if child_param and product_child is None:
            raise ProductChildNotFoundError()

        if product_child:
            request.user.favorite.save(product_childs_to_add=[product_child])
        else:
            request.user.favorite.save(product_fathers_to_add=[product_father])
        
        serializer = FavoriteSerializer(request.user.favorite, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_favorite(request, pk):
    try:
        child_param = request.query_params.get('child')
        product_father = ProductFather.objects.filter(id=pk).first()
        product_child = ProductChild.objects.filter(id=child_param).first()

        if not child_param and product_father is None:
            raise ProductFatherNotFoundError()
        
        if child_param and product_child is None:
            raise ProductChildNotFoundError()

        if product_child:
            request.user.favorite.product_childs.remove(product_child)
        else:
            request.user.favorite.product_fathers.remove(product_father)

        serializer = FavoriteSerializer(request.user.favorite, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)