from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_stores),
    path('<int:pk>', views.get_store),
]