from django.urls import path
from . import views

urlpatterns = [
    path('sign-in/token/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('sign-in/google/token/', views.GoogleOAuth2TokenObtainPairView.as_view(), name='google_token_obtain_pair'),
    path('sign-in/token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('sign-up/', views.add_user, name='sign-up'),
    path('sign-in/reset/', views.reset_password, name='reset_password'),
    path('sign-up/account/', views.search_account, name='search_account'),
    path('verify/', views.verify_account, name='verify_account')
]