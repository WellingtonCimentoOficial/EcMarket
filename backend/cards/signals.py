from django.db.models.signals import post_delete
from django.dispatch import receiver
from . models import Card
from utils.payment_gateway import Gateway
from transactions.exceptions import InternalError

@receiver(post_delete, sender=Card)
def delete_card_from_payment_gateway(sender, instance, **kwargs):
    try:
        gateway = Gateway()
        customer_id = instance.user.gateway_user_id
        card_id = instance.gateway_card_id
        gateway.delete_card(customer_id, card_id)
    except:
        raise InternalError()
