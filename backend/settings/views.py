from rest_framework.decorators import api_view
from .models import SocialMediaSetting
from .serializers import SocialMediaSettingSerializer
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def get_social_medias(request):
    social_media = SocialMediaSetting.objects.all()
    data_serialized = SocialMediaSettingSerializer(social_media, many=True, context={'request': request})
    return Response(data_serialized.data)