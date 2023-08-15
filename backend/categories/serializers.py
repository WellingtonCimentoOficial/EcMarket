from rest_framework import serializers
from .models import CategoryProduct
from products.serializers import ProductFatherMinimalSerializer

class CategoryProductSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    def get_products(self, obj):
        request = self.context.get('request')
        products = obj.productfather_set.all().order_by('-id')
        serializer = ProductFatherMinimalSerializer(products, many=True, context={'request': request})
        return serializer.data

    class Meta:
        model = CategoryProduct
        exclude = ('created_at', 'updated_at')
