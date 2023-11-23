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
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from utils.recaptcha import ReCaptcha, InvalidReCaptchaToken
from rest_framework import status
from .utils import (
    get_or_create_user_in_google, validate_google_token, 
    google_user_id_exists, validate_data_format, create_user,
    verify_user_account, create_new_password_reset_code,
    apple_user_id_exists
)
from . import exceptions
from django.contrib.auth import get_user_model

# Create your views here.
class TokenObtainPairView(TokenObtainPairViewOriginal):
    def post(self, request, *args, **kwargs):
        try:
            recaptcha_token = request.data.get("g-recaptcha-response")
            recaptcha = ReCaptcha(token=recaptcha_token)
            recaptcha.validate_token()
            
            if google_user_id_exists(request.data.get('email')):
                return Response({'cod': 4, 'error': "Authenticate via Google"}, status=status.HTTP_401_UNAUTHORIZED)
            
            if apple_user_id_exists(request.data.get('email')):
                return Response({'cod': 27, 'error': "Authenticate via Apple"}, status=status.HTTP_401_UNAUTHORIZED)
            
            return super().post(request, *args, **kwargs)
        except InvalidReCaptchaToken:
            return Response({"error": "Validation failure of reCAPTCHA"}, status=status.HTTP_400_BAD_REQUEST)
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
        except exceptions.UserAlreadyExists:
            return Response({'cod': 1, 'error': 'Authenticate using the form'}, status=status.HTTP_401_UNAUTHORIZED)
        except exceptions.InvalidGoogleToken:
            return Response({'cod': 2, 'error': 'Invalid google oauth token'}, status=status.HTTP_401_UNAUTHORIZED)
        except exceptions.InternalError:
            return Response({'cod': 3, 'error': 'An error occurred while validating the google oauth token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            if hasattr(e, "detail") and hasattr(e, "status_code"):
                return Response({'error': e.detail}, status=e.status_code)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class TokenRefreshView(TokenRefreshViewOriginal):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')

        try:
            decoded_token = RefreshToken(refresh_token)
            user_id = decoded_token['user_id']

            user = get_user_model().objects.filter(id=user_id).first()

            if user is not None:
                return super().post(request, *args, **kwargs)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except TokenError as e:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    serializer = UserSerializer(user, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
def add_user(request):
    try:
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        password = request.data.get('password')
        terms = request.data.get('terms')
        recaptcha_token = request.data.get('g-recaptcha-response')

        validate_data_format(first_name, last_name, email, password, terms)

        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        create_user(first_name=first_name, last_name=last_name, email=email, password=password)

        return Response(status=status.HTTP_201_CREATED)
    
    except exceptions.InvalidFirstNameFormat:
        return Response({'cod': 5, 'error': 'The first name format is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.InvalidLastNameFormat:
        return Response({'cod': 6, 'error': 'The last name format is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.InvalidEmailFormat:
        return Response({'cod': 7, 'error': 'The email format is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.InvalidPasswordFormat:
        return Response({'cod': 8, 'error': 'The password format is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.EmailAlreadyUsed:
        return Response({'cod': 9, 'error': 'The email is already being used'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.TermsNotAccepted:
        return Response({'cod': 10, 'error': 'Terms of use and privacy I do not accept'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidReCaptchaToken:
        return Response({'cod': 11, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def search_account(request):
    ...

@api_view(['POST'])
def send_reset_password_code(request):
    try:
        email = request.data.get('email')
        recaptcha_token = request.data.get('g-recaptcha-response')

        validate_data_format(email=email)

        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        User = get_user_model()

        user = User.objects.filter(email=email).first()

        if user is not None:
            if not user.google_user_id and not user.apple_user_id:
                password_reset_code = create_new_password_reset_code(user=user)

                return Response({'exp': password_reset_code.expiration}, status=status.HTTP_200_OK)
            raise exceptions.InvalidAuthenticationMethod()
        raise exceptions.UserNotFound()
    except exceptions.InvalidEmailFormat:
        return Response({'cod': 17, 'error': 'The email format is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidReCaptchaToken:
        return Response({'cod': 23, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.UserNotFound:
        return Response({'cod': 25, 'error': 'The user was not found'}, status=status.HTTP_404_NOT_FOUND)
    except exceptions.InvalidAuthenticationMethod:
        return Response({'cod': 26, 'error': 'The authentication method is invalid'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def confirm_reset_password_code(request):
    try:
        email = request.data.get('email')
        code = request.data.get('code')
        recaptcha_token = request.data.get('g-recaptcha-response')

        validate_data_format(email=email, password_reset_code=code)

        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        User = get_user_model()

        user = User.objects.filter(email=email).first()

        if user is not None:
            if user.password_reset_code.code == code:
                if not user.password_reset_code.is_expired():
                    return Response(status=status.HTTP_200_OK)
                return Response({'cod': 18, 'error': 'The password reset code is expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'cod': 19, 'error': 'The password reset code is invalid'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    except exceptions.InvalidEmailFormat:
        return Response({'cod': 20, 'error': 'The email format is invalid'}, status=status.HTTP_401_UNAUTHORIZED)
    except exceptions.InvalidPasswordResetCodeFormat:
        return Response({'cod': 21, 'error': 'The password reset code format is invalid'}, status=status.HTTP_401_UNAUTHORIZED)
    except InvalidReCaptchaToken:
        return Response({'cod': 22, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def reset_password(request):
    try:
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('password')
        recaptcha_token = request.data.get('g-recaptcha-response')

        User = get_user_model()

        validate_data_format(password_reset_code=code, password=new_password)

        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        user = User.objects.filter(email=email).first()
        
        if user is not None:
            if user.password_reset_code.code == code:
                if not user.password_reset_code.is_expired():
                    if not user.google_user_id and not user.apple_user_id:
                        user.set_password(new_password)
                        user.save()
                        return Response(status=status.HTTP_200_OK)
                    raise exceptions.InvalidAuthenticationMethod()
                raise exceptions.ExpiredPasswordResetCode()
            raise exceptions.InvalidPasswordResetCodeFormat()
        raise exceptions.UserNotFound()
    except exceptions.InvalidPasswordResetCodeFormat:
        return Response({'cod': 32, 'error': 'The password reset code format is invalid'}, status=status.HTTP_401_UNAUTHORIZED)
    except exceptions.InvalidPasswordFormat:
        return Response({'cod': 28, 'error': 'The password format is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidReCaptchaToken:
        return Response({'cod': 29, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.UserNotFound:
        return Response({'cod': 30, 'error': 'The user was not found'}, status=status.HTTP_404_NOT_FOUND)
    except exceptions.InvalidAuthenticationMethod:
        return Response({'cod': 31, 'error': 'The authentication method is invalid'}, status=status.HTTP_401_UNAUTHORIZED)
    except exceptions.ExpiredPasswordResetCode:
        return Response({'cod': 33, 'error': 'The password reset code is expired'}, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_account(request):
    try:
        code = request.data.get('code')
        recaptcha_token = request.data.get('g-recaptcha-response')

        verify_user_account(code=code)
        
        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        return Response(status=status.HTTP_200_OK)
    except exceptions.InvalidVerificationCodeFormat:
        return Response({'cod': 13, 'error': 'Invalid verification code format'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.ExpiredVerificationCode:
        return Response({'cod': 12, 'error': 'Expired Verification code'}, status=status.HTTP_401_UNAUTHORIZED)
    except exceptions.AccountAlreadyVerified:
        return Response({'cod': 14, 'error': 'Your account has already been verified'}, status=status.HTTP_400_BAD_REQUEST)
    except exceptions.InvalidVerificationCode:
        return Response({'cod': 15, 'error': 'Invalid verification code'}, status=status.HTTP_401_UNAUTHORIZED)
    except exceptions.VerificationCodeNotFound:
        return Response({'cod': 16, 'error': 'Verification code not found'}, status=status.HTTP_404_NOT_FOUND)
    except InvalidReCaptchaToken:
        return Response({'cod': 24, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)