from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView as TokenObtainPairViewOriginal,
    TokenRefreshView as TokenRefreshViewOriginal,
)
from utils.recaptcha import ReCaptcha
from rest_framework import status

# Create your views here.
class TokenObtainPairView(TokenObtainPairViewOriginal):
    def post(self, request, *args, **kwargs):
        recaptcha_token = request.data.get("g-recaptcha-response")
        if not ReCaptcha(token=recaptcha_token).validate_token():
            return Response({"error": "Validation failure of reCAPTCHA"}, status=status.HTTP_400_BAD_REQUEST)
        return super().post(request, *args, **kwargs)

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