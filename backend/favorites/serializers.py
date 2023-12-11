from rest_framework import serializers
from .models import Favorite
from products.serializers import ProductFatherMinimalSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    products = ProductFatherMinimalSerializer(many=True, read_only=True)

    class Meta:
        model = Favorite
        exclude = ['user']