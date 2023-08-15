from utils.payment_gateway import Gateway
from cards.models import Card
from .exceptions import InvalidCardPayloadDataError

def save_card(user_instance, card_token):
    try:
        payload = {"token": card_token}
        gateway = Gateway()
        response = gateway.save_card(user_instance.gateway_user_id, payload)
        if response.status_code == 200 or response.status_code == 201:
            response_json = response.json()
            card = Card.objects.create(
                user=user_instance,
                gateway_card_id=response_json["id"],
                first_six_digits=response_json["first_six_digits"],
                last_four_digits=response_json["last_four_digits"],
                expiration_month=response_json["expiration_month"],
                expiration_year=response_json["expiration_year"],
                cardholder_name=response_json["cardholder"]["name"],
                cardholder_document_number=response_json["cardholder"]["identification"]["number"],
                cardholder_document_type=response_json["cardholder"]["identification"]["type"],
                paymentmethod_name=response_json["payment_method"]["name"],
                paymentmethod_id=response_json["payment_method"]["id"],
                paymentmethod_type_id=response_json["payment_method"]["payment_type_id"],
                secutirycode_length=response_json["security_code"]["length"]
            )
            return card
        raise InvalidCardPayloadDataError()
    except Exception as e:
        raise e
    
def change_card(user_instance, gateway_card_id, card_token):
    payload = {"token": card_token}

    gateway = Gateway()

    response = gateway.update_card(user_instance.gateway_user_id, gateway_card_id, payload)
    if response.status_code == 200:
        response_json = response.json()
        card = user_instance.cards.filter(gateway_card_id=gateway_card_id).first()

        if card is not None:
            card.gateway_card_id=response_json["id"],
            card.first_six_digits=response_json["first_six_digits"],
            card.last_four_digits=response_json["last_four_digits"],
            card.expiration_month=response_json["expiration_month"],
            card.expiration_year=response_json["expiration_year"],
            card.cardholder_name=response_json["cardholder"]["name"],
            card.cardholder_document_number=response_json["cardholder"]["identification"]["number"],
            card.cardholder_document_type=response_json["cardholder"]["identification"]["type"],
            card.paymentmethod_name=response_json["payment_method"]["name"],
            card.paymentmethod_id=response_json["payment_method"]["id"],
            card.paymentmethod_type_id=response_json["payment_method"]["payment_type_id"],
            card.secutirycode_length=response_json["security_code"]["length"]
            card.save()

            return card

    raise InvalidCardPayloadDataError()

