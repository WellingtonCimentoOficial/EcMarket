from rest_framework.decorators import api_view
from .models import ProductBrand
from .serializers import ProductBrandSerializer
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def get_brands(request):
    brands = ProductBrand.objects.order_by('-id')
    serializer = ProductBrandSerializer(brands, many=True, context={'request': request})

    return Response(serializer.data)