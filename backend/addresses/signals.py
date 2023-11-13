from django.db.models.signals import pre_save, post_save
from .models import UserAddress, UserDeliveryAddress
from django.dispatch import receiver
from utils.payment_gateway import Gateway
from users.utils import create_user_payload_to_payment_gateway

@receiver(pre_save, sender=UserAddress)
@receiver(pre_save, sender=UserDeliveryAddress)
def format_fields(sender, instance, **kwargs):
    if instance.uf is not None and instance.country is not None:
        instance.uf = instance.uf.upper()
        instance.country = instance.country.upper()


@receiver(post_save, sender=UserAddress) # atualiza o endereço do usuario no mercado pago
def update_gateway_payment_user_address(sender, instance, created, **kwargs):
    # quando eu testei o endereço não estava sendo alterado, talvez seja porque eu não estava usando as chaves da api de produção
    try:
        gateway = Gateway()
        payload = create_user_payload_to_payment_gateway(instance.user, update_user=True)
        gateway.update_customer(instance.user.gateway_user_id, payload)
    except:
        pass