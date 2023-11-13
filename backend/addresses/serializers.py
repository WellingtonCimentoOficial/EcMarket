from rest_framework import serializers
from .models import UserAddress, UserDeliveryAddress

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        exclude = ['user']

class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDeliveryAddress
        exclude = ['user']