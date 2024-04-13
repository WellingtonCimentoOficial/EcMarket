from rest_framework import serializers
from .models import Favorite
from products.serializers import ProductFatherMinimalSerializer, ProductChildDetailSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    product_fathers = ProductFatherMinimalSerializer(many=True, read_only=True)
    product_childs = ProductChildDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Favorite
        exclude = ['user']