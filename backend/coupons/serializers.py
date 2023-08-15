from rest_framework import serializers
from .models import GlobalDiscountCoupon

class GlobalDiscountCouponSerializer(serializers.ModelSerializer):
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2, coerce_to_string=False)
    class Meta:
        model = GlobalDiscountCoupon
        fields = '__all__'