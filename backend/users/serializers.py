from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['user_first_name'] = user.first_name
        token['user_last_name'] = user.last_name
        token['user_email'] = user.email
        token['is_verified'] = user.is_verified
        
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password', 'google_user_id', 'apple_user_id', 'gateway_user_id')
        