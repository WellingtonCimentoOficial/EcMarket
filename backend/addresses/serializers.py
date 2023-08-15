from rest_framework import serializers
from .models import Address, DeliveryAddress

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        exclude = ['user']

class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAddress
        exclude = ['user']