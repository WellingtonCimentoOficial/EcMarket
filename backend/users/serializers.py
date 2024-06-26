from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.db.models import Sum

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        # token['user_first_name'] = user.first_name
        # token['user_last_name'] = user.last_name
        # token['user_email'] = user.email
        # token['is_verified'] = user.is_verified
        
        return token
    
class MyTokenRefreshSerializer(TokenRefreshSerializer):
    ...

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password', 'google_user_id', 'apple_user_id', 'gateway_user_id')

class UserProfileSerializer(serializers.ModelSerializer):
    cart_quantity = serializers.SerializerMethodField()
    wishlist_quantity = serializers.SerializerMethodField()

    def get_cart_quantity(self, obj):
        return obj.carts.aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0

    def get_wishlist_quantity(self, obj):
        if hasattr(obj, 'favorite'):
            return obj.favorite.product_fathers.count() + obj.favorite.product_childs.count()
        return 0

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'is_verified', 'id_number', 'cart_quantity', 'wishlist_quantity')
        