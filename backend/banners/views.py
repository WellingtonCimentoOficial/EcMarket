from .models import HomeBanner
from .serializers import HomeBannerSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def get_home_page_banners(request):
    all_banners = HomeBanner.objects.all()
    all_banners_serialized = HomeBannerSerializer(all_banners, many=True, context={'request': request})
    return Response(all_banners_serialized.data)