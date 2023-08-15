from utils.payment_gateway import Gateway
from transactions.exceptions import InternalError

def create_user_payload_to_payment_gateway(user_instance, update_user=False):
    try:
        payload = {
            "email": user_instance.email if not update_user else None,
            "first_name": user_instance.first_name if user_instance.first_name else None,
            "last_name": user_instance.last_name if user_instance.last_name else None,
            "phone":{
                "area_code": None,
                "number": None
            },
            "identification":{
                "type": None,
                "number": None
            },
            "default_address": None,
            "address":{
                "zip_code": str(user_instance.address.zip_code) if hasattr(user_instance, 'address') and user_instance.address.zip_code else None,
                "street_name": str(user_instance.address.street) if hasattr(user_instance, 'address') and user_instance.address.street else None,
                "street_number": int(user_instance.address.number) if hasattr(user_instance, 'address') and user_instance.address.number else None,
                "city":{
                    "name": str(user_instance.address.city) if hasattr(user_instance, 'address') and user_instance.address.city else None
                }
            },
            "date_registered": user_instance.date_joined.strftime('%Y-%m-%dT%H:%M:%S.%f%z') if user_instance.date_joined else None,
            "description": None,
            "default_card": None
        }
        return payload
    except:
        raise InternalError()

def get_or_create_user_in_payment_gateway(user_instance):
    # https://www.mercadopago.com.br/developers/en/reference/customers/_customers/post
    
    payload = create_user_payload_to_payment_gateway(user_instance)

    gateway = Gateway()

    response_search = gateway.search_customer(user_instance.email)

    if response_search.status_code == 200:

        results = response_search.json().get("results")

        if len(results) == 0:
            response = gateway.create_customer(payload)

            if response.status_code == 200 or response.status_code == 201:
                data = response.json()

                user_instance.gateway_user_id = data["id"]
                user_instance.save()

                return data
            
        if len(results) == 1:
            if not user_instance.gateway_user_id:
                user_instance.gateway_user_id = results[0]["id"]
                user_instance.save()

            return results[0]