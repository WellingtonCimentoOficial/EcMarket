from rest_framework import serializers
from .models import SocialMediaSetting

class SocialMediaSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaSetting
        fields = '__all__'