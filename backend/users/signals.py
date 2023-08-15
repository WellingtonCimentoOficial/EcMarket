from django.db.models.signals import post_save
from django.dispatch import receiver
from favorites.models import Favorite
from cart.models import Cart
from .models import User
from .utils import get_or_create_user_in_payment_gateway

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
def create_user_favorites(sender, instance, created, **kwargs):
    if created:
        #creating a favorites
        Favorite.objects.create(user=instance)

        #creating a cart
        Cart.objects.create(user=instance)