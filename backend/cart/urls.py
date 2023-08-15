from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_cart),
    path('create', views.add_product),
    path('update/<int:pk>', views.update_product),
    path('delete/<int:pk>', views.delete_product),
]