from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_products),
    path('<int:pk>', views.get_product),
    path('name/', views.get_products_name),
    path('filters/', views.get_product_filters),
    path('<int:pk>/delivery/<str:zip_code>', views.get_product_delivery),
    
    path('<int:pk>/children', views.get_children),
]