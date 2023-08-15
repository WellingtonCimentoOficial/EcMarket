from django.shortcuts import render
from .models import Store
from .serializers import StoreSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
@api_view(['GET'])
def get_stores(request):
    try:
        stores = Store.objects.all().order_by('-id')
        serializer = StoreSerializer(stores, many=True, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_store(request, pk):
    try:
        stores = Store.objects.get(id=pk)
        serializer = StoreSerializer(stores, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)