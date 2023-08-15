from django.shortcuts import render
from .models import GlobalDiscountCoupon
from .serializers import GlobalDiscountCouponSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination


# Create your views here.
class CouponPagination(LimitOffsetPagination):
    PAGE_SIZE = 5
    default_limit = 5
    max_limit = 100

@api_view(['GET'])
def get_coupons(request):
    coupons = GlobalDiscountCoupon.objects.all().order_by('-id')

    paginator = CouponPagination()
    paginated_coupons = paginator.paginate_queryset(coupons, request)

    serializer = GlobalDiscountCouponSerializer(paginated_coupons, many=True, context={'request': request})
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_coupon(request, pk):
    coupon = GlobalDiscountCoupon.objects.filter(id=pk).first()
    if coupon is not None:
        serializer = GlobalDiscountCouponSerializer(coupon, context={'request': request})
        return Response(serializer.data)
    return Response(status=status.HTTP_404_NOT_FOUND)