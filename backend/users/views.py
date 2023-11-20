from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView as TokenObtainPairViewOriginal,
    TokenRefreshView as TokenRefreshViewOriginal,
)
from utils.recaptcha import ReCaptcha
from rest_framework import status
from .utils import get_or_create_user_in_google, validate_google_token, google_user_id_exists
from .exceptions import UserAlreadyExists, InvalidGoogleToken, InternalError

# Create your views here.
class TokenObtainPairView(TokenObtainPairViewOriginal):
    def post(self, request, *args, **kwargs):
        try:
            recaptcha_token = request.data.get("g-recaptcha-response")
            if not ReCaptcha(token=recaptcha_token).validate_token():
                return Response({"error": "Validation failure of reCAPTCHA"}, status=status.HTTP_400_BAD_REQUEST)
            
            if google_user_id_exists(request.data.get('email')):
                return Response({'cod': 4, 'error': "Authenticate via google"}, status=status.HTTP_401_UNAUTHORIZED)
            
            return super().post(request, *args, **kwargs)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class GoogleOAuth2TokenObtainPairView(TokenObtainPairViewOriginal):
    def post(self, request):
        try:
            token = request.data.get('token')
            
            user_info = validate_google_token(token=token)
            user = get_or_create_user_in_google(user_info=user_info)
            
            authenticated_user = authenticate(request, username=user.email, password=user_info['sub'], user=user)

            if authenticated_user:
                access_token = str(RefreshToken.for_user(authenticated_user).access_token)
                refresh_token = str(RefreshToken.for_user(authenticated_user))
                return Response({'access': access_token, 'refresh': refresh_token}, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except UserAlreadyExists:
            return Response({'cod': 1, 'error': 'Authenticate using the form'}, status=status.HTTP_401_UNAUTHORIZED)
        except InvalidGoogleToken:
            return Response({'cod': 2, 'error': 'Invalid google oauth token'}, status=status.HTTP_401_UNAUTHORIZED)
        except InternalError:
            return Response({'cod': 3, 'error': 'An error occurred while validating the google oauth token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            if hasattr(e, "detail") and hasattr(e, "status_code"):
                return Response({'error': e.detail}, status=e.status_code)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class TokenRefreshView(TokenRefreshViewOriginal):
    ...

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    serializer = UserSerializer(user, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
def create_user(request):
    ...

@api_view(['POST'])
def reset_password(request):
    ...

@api_view(['POST'])
def search_account(request):
    ...