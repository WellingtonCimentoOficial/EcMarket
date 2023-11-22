from django.db.models.signals import post_save
from django.dispatch import receiver
from favorites.models import Favorite
from cart.models import Cart
from django.contrib.auth import get_user_model
from .utils import get_or_create_user_in_payment_gateway, create_new_verification_code
from django.core.mail import EmailMessage
from django.conf import settings
from users.models import VerificationCode
import os

User = get_user_model()

@receiver(post_save, sender=User)
def create_customer_gateway(sender, instance, created, **kwargs):
    # verifing that user was created
    if created:
        try:
            # creating a user in gateway payment
            get_or_create_user_in_payment_gateway(instance)
        except:
            pass

@receiver(post_save, sender=User)
def create_user_profile_and_related_objects(sender, instance, created, **kwargs):
    if created:
        #creating a favorites
        Favorite.objects.create(user=instance)

        #creating a cart
        Cart.objects.create(user=instance)

        #creating a verification code
        create_new_verification_code(user=instance)

@receiver(post_save, sender=VerificationCode)
def send_account_verification_code(sender, instance, created, **kwargs):
    if not instance.user.is_verified:
        email = EmailMessage(
            "Verificação de conta",
            f"Para fazer a verificação da sua conta, clique no link: {os.getenv('DOMAIN_URL')}/accounts/verify?code={instance.code}\nLembrando que o link tem um prazo de validade de 10 minutos.",
            settings.EMAIL_HOST_USER,
            [instance.user.email],
        )
        email.send(fail_silently=True)