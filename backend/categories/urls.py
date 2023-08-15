from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_categories),
    path('<int:pk>', views.get_category),
    path('name/', views.get_categories_name),
]