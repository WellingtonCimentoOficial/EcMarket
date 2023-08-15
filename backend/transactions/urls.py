from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_transactions, name='get_transactions'),
    path('<int:pk>', views.get_transaction, name='get_transaction'),
    path('update/status', views.update_status, name='update_order_status'),
    path('process_payment', views.create_payment, name='process_payment')
]