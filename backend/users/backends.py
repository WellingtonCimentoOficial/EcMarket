from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password


class GooglePasswordBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        Autentica um usuário com base no email e na senha do Google.
        """
        user_model = get_user_model()

        try:
            user = user_model.objects.get(email=username)
            if check_password(password, user.google_password):
                if self.user_can_authenticate(user):
                    return user
        except user_model.DoesNotExist:
            return None
