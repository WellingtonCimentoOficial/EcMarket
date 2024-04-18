from rest_framework import serializers
from .models import Cart
from products.serializers import ProductFatherDetailSerializer, ProductChildDetailSerializer

class CartSerializer(serializers.ModelSerializer):
    product_father = ProductFatherDetailSerializer(read_only=True)
    product_child = ProductChildDetailSerializer(read_only=True)

    class Meta:
        model = Cart
        exclude = ['user']