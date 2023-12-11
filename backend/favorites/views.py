from django.shortcuts import render
from .serializers import FavoriteSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from products.models import ProductFather
from products.exceptions import ProductNotFoundError

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
        product = ProductFather.objects.filter(id=pk).first()

        if product is None:
            raise ProductNotFoundError()
        
        request.user.favorite.products.add(product)

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
        product = ProductFather.objects.filter(id=pk).first()

        if product is not None:
            request.user.favorite.products.remove(product)
        else:
            raise ProductNotFoundError()

        serializer = FavoriteSerializer(request.user.favorite, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)