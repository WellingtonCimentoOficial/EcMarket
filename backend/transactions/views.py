from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Transaction
from rest_framework import status
from utils.payment_gateway import Gateway
from .permissions import IsPaymentGateway
from rest_framework.permissions import IsAuthenticated
from .serializers import TransactionSerializer
from datetime import datetime
from .utils import calculate_purchase_price, create_payment_request_payload, update_products_stock, process_payment, map_status_to_numeric
from users.utils import get_or_create_user_in_payment_gateway
# from cart.utils import validate_cart_products
from .utils import check_product_owner

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):
    #transaction_amount = float(request.data.get("transaction_amount"))
    card_token = request.data.get("token", "")
    installments = int(request.data.get("installments", 1)) #if the number of installments is not sent, it will be automatically defined as 1 installment
    payment_method_id = request.data.get("payment_method_id")
    document_type = request.data.get("payer", {}).get("identification", {}).get("type")
    document_number = request.data.get("payer", {}).get("identification", {}).get("number")
    discount_coupon = request.data.get("discount_coupon")
    
    try:
        #checking if the user has an registered address
        request.user.has_address()

        # checking if user has a gateway_user_id
        get_or_create_user_in_payment_gateway(request.user)

        #checking if the user has an existing shopping cart
        request.user.has_shopping_cart()

        #checking if the user cart is not empty
        request.user.cart.is_full()

        # checking if the current user is the owner of the product
        check_product_owner(request.user)

        cart_products = request.user.cart.products

        #checking that all products in the shopping cart still exist and that the quantity is less than or equal to what is in stock
        # validate_cart_products(cart_products)

        #calculating the purchase price
        transaction_amount = calculate_purchase_price(discount_coupon, cart_products, installments, payment_method_id)

        #creating a gateway payment payload
        items, payment_data = create_payment_request_payload(request, cart_products, transaction_amount, card_token, installments, payment_method_id, document_type, document_number)

        #sending the information to the payment gateway
        response_json = process_payment(request, items, card_token, payment_data).json()

        #update the stock of products, based on the quantity purchased
        update_products_stock(cart_products)

        data = {
            "payment_method": response_json["payment_type_id"],
            "status": response_json["status"],
            "transaction_data": {
                "qr_code": response_json.get("point_of_interaction", {}).get("transaction_data", {}).get("qr_code"),
                "qr_code_base64": response_json.get("point_of_interaction", {}).get("transaction_data", {}).get("qr_code_base64"),
                "external_resource_url": response_json.get("transaction_details", {}).get("external_resource_url")
            }
        }

    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsPaymentGateway])
def update_status(request):
    try:
        transaction_id = request.data.get("data").get("id")
        transaction = Transaction.objects.filter(gateway_transaction_id=transaction_id).first()
        if transaction is not None:
            gateway = Gateway()
            response = gateway.get_payment(transaction.gateway_transaction_id)
            if response.status_code == 200:
                payment = response.json()
                transaction.status = map_status_to_numeric(payment["status"])
                transaction.updated_at = datetime.strptime(payment["date_last_updated"], '%Y-%m-%dT%H:%M:%S.%f%z')
                transaction.save()

                # verifying that the transaction was canceled and then returning the products to stock
                if map_status_to_numeric(payment["status"]) == 2:
                    update_products_stock(transaction.products, reserve_stock=False)
                return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    transactions = request.user.transactions.all()
    serializer = TransactionSerializer(transactions, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transaction(request, pk):
    transactions = request.user.transactions.filter(transaction_id=pk)
    serializer = TransactionSerializer(transactions, many=True, context={'request': request})
    return Response(serializer.data)