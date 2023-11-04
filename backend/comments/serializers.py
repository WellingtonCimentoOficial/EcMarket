from rest_framework import serializers
from .models import ProductComment, StoreComment

class ProductCommentSerializer(serializers.ModelSerializer):
    rating = serializers.DecimalField(max_digits=2, decimal_places=1, coerce_to_string=False)
    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        data = {
            "id": obj.owner.id,
            "first_name": obj.owner.first_name,
            "last_name": obj.owner.last_name,
        }
        return data

    class Meta:
        model = ProductComment
        exclude = ['product']

class StoreCommentSerializer(serializers.ModelSerializer):
    rating = serializers.DecimalField(max_digits=2, decimal_places=1, coerce_to_string=False)
    class Meta:
        model = StoreComment
        exclude = ['store']