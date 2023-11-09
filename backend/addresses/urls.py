from django.urls import path
from . import views

urlpatterns = [
    path('address/', views.get_address),
    path('address/create', views.add_address),
    path('address/update', views.update_address),
    path('delivery/', views.get_delivery_addresses),
    path('delivery/create', views.add_delivery_address),
    path('delivery/update/<int:pk>', views.update_delivery_address),
    path('delivery/delete/<int:pk>', views.delete_delivery_address),
    path('cep/<str:zip_code>', views.get_cep_info),
]