from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_cards),
    path('<int:pk>', views.get_card),
    path('update/<int:pk>', views.update_card),
    path('delete/<int:pk>', views.delete_card),
]