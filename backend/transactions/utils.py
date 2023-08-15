from .exceptions import InvalidPaymentMethodError, InvalidTransactionError
from products.models import ProductChild
from coupons.models import GlobalDiscountCoupon
from django.urls import reverse
from utils.payment_gateway import Gateway
from .models import Transaction
from datetime import datetime
from .exceptions import InvalidTransactionStatusError, UnauthorizedProductPurchaseError
from cart.exceptions import InvalidShoppingCartItemError
from uuid import uuid4
from cards.utils import save_card
from products.exceptions import ProductNotFoundError
import os
    
def map_payment_method_to_numeric(payment_method_id):
    payment_method_mapping = {
        "bolbradesco": 1,
        "pix": 2,
        "debvisa": 0,
        "elo": 0,
        "hipercard": 0,
        "master": 0,
        "cabal": 0,
        "amex": 0,
        "visa": 0,
        "debmaster": 3,
        "debcabal": 3,
        "debelo": 3,
        "debvisa": 3
    }

    if payment_method_id in payment_method_mapping:
        return payment_method_mapping[payment_method_id]
    raise InvalidPaymentMethodError()

def map_status_to_numeric(status):
    status_mapping = {
        "pending": 0,
        "approved": 1,
        "rejected": 2
    }
    if status in status_mapping:
        return status_mapping[status]
    raise InvalidTransactionStatusError()
        
def calculate_purchase_price(discount_coupon, products, installments, payment_method):
    transaction_amount = 0
    
    discount_coupon_obj = GlobalDiscountCoupon.objects.filter(code=discount_coupon).first()
    if discount_coupon_obj:
        for product in products:
            try:
                product_instance = ProductChild.objects.get(id=product.get("id"))
            except:
                raise InvalidShoppingCartItemError()
            if discount_coupon_obj.validate_product(product_instance, payment_method) and product_instance.discount_price:
                product_amount = product.get("quantity") * product_instance.discount_price
                percentage_calc = product_amount * (discount_coupon_obj.percentage / 100)
                result = product_amount - percentage_calc
                transaction_amount += result
            else:
                product_amount = product.get("quantity") * product_instance.default_price
                percentage_calc = product_amount * (discount_coupon_obj.percentage / 100)
                result = product_amount - percentage_calc
                transaction_amount += result
    elif installments == 1:
        for product in products:
            try:
                product_instance = ProductChild.objects.get(id=product.get("id"))
            except:
                raise InvalidShoppingCartItemError()
            if product_instance.discount_price:
                transaction_amount += product.get("quantity") * product_instance.discount_price
            else:
                transaction_amount += product.get("quantity") * product_instance.default_price
    else:
        for product in products:
            try:
                product_instance = ProductChild.objects.get(id=product.get("id"))
            except:
                raise InvalidShoppingCartItemError()
            transaction_amount += product.get("quantity") * product_instance.default_price
    
    return round(transaction_amount, 2)


def create_payment_request_payload (request, products, transaction_amount, card_token, installments, payment_method_id, document_type, document_number):
    #creating a transaction uuid
    transaction_id = uuid4()
    
    #creating the payment gateway item parameter
    items = []
    
    # creating the items atribute in payment gateway JSON
    for product in products:
        product_instance = ProductChild.objects.get(id=product["id"])
        items.append({
            "id": product_instance.id,
            "title": product_instance.product_father.name,
            "description": product_instance.product_father.description,
            "picture_url": request.build_absolute_uri(product_instance.principal_image.url),
            "category_id": product_instance.product_father.categories.first().name,
            "quantity": product.get("quantity"),
            "unit_price": float(product_instance.default_price)
        })

    # creating the payment gateway JSON
    payment_data = {
        "transaction_amount": float(transaction_amount),
        "token": card_token if map_payment_method_to_numeric(payment_method_id) == 0 or map_payment_method_to_numeric(payment_method_id) == 3 else "", # if payment method is not credit card or debit card, token will be set to a empty string
        "description": ' | '.join(prod["title"] for prod in items),
        "installments": installments if map_payment_method_to_numeric(payment_method_id) == 0 else 1, # if payment method is not credit card, installment will be set to 1 installment only
        "payment_method_id": payment_method_id,
        "payer": {
            "id": request.user.gateway_user_id,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
            "identification": {
                "type": document_type, 
                "number": document_number
            },
            "type": "customer"
        },
        "notification_url": f"{os.getenv('DOMAIN_URL')}{reverse('update_order_status')}",
        "additional_info": {
            "ip_address": request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR'),
            "items": items
        },
        "capture": True,
        "external_reference": str(transaction_id)
    }

    return items, payment_data


def update_products_stock(products, reserve_stock=True):
    for product in products:
        product_instance = ProductChild.objects.filter(id=product.get("id")).first()
        if product_instance is not None:
            if reserve_stock:
                product_instance.quantity = product_instance.quantity - product.get("quantity")
            else:
                product_instance.quantity = product_instance.quantity + product.get("quantity")
            product_instance.save()


def process_payment(request, products, card_token, payment_payload):                        # atualizar os dados do usuario no mercado pago quando ele finalizar uma compra no signal
    #creating a transaction
    Transaction.objects.create(
        user=request.user,
        transaction_id=payment_payload["external_reference"],
        amount=payment_payload["transaction_amount"],
        payment_method=map_payment_method_to_numeric(payment_payload["payment_method_id"]),
        installments=payment_payload["installments"],
        status=0,
        products=[{"id": prod["id"], "title": prod["title"], "quantity": prod["quantity"], "unit_price": prod["unit_price"]} for prod in products],
    )

    # instantiating the gateway
    gateway = Gateway()

    #creating a gateway transaction
    response = gateway.create_payment(payment_payload)
    
    #verifing transaction was created with success
    if response.status_code == 200 or response.status_code == 201:
        #getting a json response
        payment = response.json()
        
        #updating a transaction in db with a response gateway data
        Transaction.objects.filter(transaction_id=payment_payload["external_reference"]).update(
            gateway_transaction_id=payment["id"], 
            gateway_response=payment,
            created_at=datetime.strptime(payment["date_created"], '%Y-%m-%dT%H:%M:%S.%f%z'),
            updated_at=datetime.strptime(payment["date_last_updated"], '%Y-%m-%dT%H:%M:%S.%f%z'),
        )
        #checking that payment method is credit card or debit card
        if map_payment_method_to_numeric(payment_payload["payment_method_id"]) == 0 or map_payment_method_to_numeric(payment_payload["payment_method_id"]) == 0:
            #checking that user dont have a card with first six digits and last four digits equal to the one he made a purchase and then saving a
            if len(request.user.cards.filter(first_six_digits=payment["card"]["first_six_digits"], last_four_digits=payment["card"]["last_four_digits"])) == 0:
                try:
                    save_card(request.user, card_token)
                except:
                    pass
        return response
    
    #deleting a transaction if payment gateway to return a different status code of 200 or 201
    Transaction.objects.get(transaction_id=payment_payload["external_reference"]).delete()
    raise InvalidTransactionError()


def check_product_owner(user_instance):
    for product in user_instance.cart.products:
        product_instance = ProductChild.objects.filter(id=product["id"]).first()
        if product_instance is not None:
            if product_instance.product_father.store.owner == user_instance:
                raise UnauthorizedProductPurchaseError()
        else:
            raise ProductNotFoundError()
    return True