from django.urls import path
from . import views

urlpatterns = [
    path('socialmedia/', views.get_social_medias),
]