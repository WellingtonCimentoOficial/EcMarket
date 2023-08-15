from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_coupons),
    path('<int:pk>', views.get_coupon),
]