from django.db.models.signals import post_save
from django.dispatch import receiver
from favorites.models import Favorite
from django.contrib.auth import get_user_model
from .utils import get_or_create_user_in_payment_gateway, create_new_account_verification_code, send_account_verification_code
from django.core.mail import EmailMessage
from django.conf import settings
from users.models import VerificationCode, PasswordResetCode
from django.contrib.auth.models import Group

User = get_user_model()

@receiver(post_save, sender=User)
def create_customer_gateway_signal(sender, instance, created, **kwargs):
    # verifing that user was created
    if created:
        try:
            # creating a user in gateway payment
            get_or_create_user_in_payment_gateway(instance)
        except:
            pass

@receiver(post_save, sender=User)
def create_user_profile_and_related_objects_signal(sender, instance, created, **kwargs):
    if created:
        #creating a favorites
        Favorite.objects.create(user=instance)

        #creating a verification code
        create_new_account_verification_code(user=instance)
        
        # adding the user to the customers group
        group = Group.objects.get_or_create(name='customer')[0]
        group.user_set.add(instance)

@receiver(post_save, sender=VerificationCode)
def send_account_verification_code_signal(sender, instance, created, **kwargs):
    code = instance.code
    user = instance.user

    if not user.is_verified:
        try:
            send_account_verification_code(user_instance=user, code=code)
        except:
            ...

@receiver(post_save, sender=PasswordResetCode)
def send_password_reset_code_signal(sender, instance, created, **kwargs):
    email = EmailMessage(
        "Trocar de senha",
        f"Para fazer a troca de senha da sua conta, utilize as informações abaixo.\nCÓDIGO: {instance.code}\nLembrando que o link tem um prazo de validade de 10 minutos.",
        settings.EMAIL_HOST_USER,
        [instance.user.email],
    )
    email.send(fail_silently=True)