from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_products),
    path('<int:pk>', views.get_product),
    path('name/', views.get_products_name),
    path('filters/', views.get_product_filters),
    path('delivery/<int:pk>', views.get_product_delivery),
]