from django.urls import path
from . import views

urlpatterns = [
    path('product/create', views.add_product_comment),
    path('product/<int:pk>', views.get_product_comments),
    path('product/update/<int:pk>', views.update_product_comment),
    path('product/delete/<int:pk>', views.delete_product_comment),
    
    path('store/create', views.add_store_comment),
    path('store/<int:pk>', views.get_store_comments),
    path('store/update/<int:pk>', views.update_store_comment),
    path('store/delete/<int:pk>', views.delete_store_comment),
]