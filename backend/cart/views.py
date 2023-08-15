from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer
from .utils import validate_cart_products, update_cart_product, delete_cart_product, add_cart_product
from rest_framework import status

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = request.user.cart
    serializer = CartSerializer(cart, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    new_products = request.data.get("products", [])
    try:
        # checking if user has a shopping cart
        request.user.has_shopping_cart()
        
        # assigning the user's shopping cart in the variable
        cart = request.user.cart

        #validating products
        validate_cart_products(new_products)
        
        # adding products in cart
        add_cart_product(cart, new_products)
        
        # serializing the shopping cart and returning the updated products
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    try:
        quantity = request.data.get("quantity")
        
        # checking if user has a shopping cart
        request.user.has_shopping_cart()
        
        # assigning the user's shopping cart in the variable
        cart = request.user.cart

        #checking if the user cart is not empty
        request.user.cart.is_full()

        # updating a product
        update_cart_product(cart, pk, quantity=quantity)

        # serializing a cart data and returning for user
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    try:
        # checking if user has a shopping cart
        request.user.has_shopping_cart()
        
        # assigning the user's shopping cart in the variable
        cart = request.user.cart

        #checking if the user cart is not empty
        request.user.cart.is_full()

        # deleting a product
        delete_cart_product(cart, pk)

        # serializing a cart data and returning for user
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)