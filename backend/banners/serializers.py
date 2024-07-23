from rest_framework import serializers
from .models import HomeBanner

class HomeBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeBanner
        fields = "__all__"