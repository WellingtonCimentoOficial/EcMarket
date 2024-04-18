from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer
from rest_framework import status
from products.models import ProductFather, ProductChild
from products.exceptions import ProductFatherNotFoundError, ProductChildNotFoundError
from .models import Cart
from .exceptions import InvalidQuantitytFormatError, ShoppingCartNotFoundError, InvalidQuantitytError
from django.db.models import Sum, F
from django.db.models.functions import Coalesce

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    carts = Cart.objects.filter(user=request.user).order_by("-id")
    serializer = CartSerializer(carts, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_details(request):
    user_carts = Cart.objects.filter(user=request.user)

    products_quantity = user_carts.aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0

    total_price = user_carts.aggregate(
        full_total_price=Sum(F("quantity") * Coalesce("product_child__default_price", "product_father__default_price"))
    )["full_total_price"]

    total_discount_price = user_carts.annotate(
        price_difference=Coalesce(
            F("product_child__default_price") - F("product_child__discount_price"),
            F("product_father__default_price") - F("product_father__discount_price")
        )
    ).aggregate(
        total_discount_price=Sum(
            F("quantity") * F("price_difference")
        )
    )["total_discount_price"]

    final_price = total_price - total_discount_price

    data = {
        "products_quantity": products_quantity,
        "total_price": total_price,
        "shipping_price": 0,
        "tax_price": 0,
        "coupon_discount_price": 0,
        "total_discount_price": total_discount_price,
        "final_price": final_price
    }
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request, pk):
    try:
        product_child_id_param = request.data.get("childId")
        quantity = request.data.get("quantity")
        product_father = ProductFather.objects.filter(id=pk).first()
        product_child = ProductChild.objects.filter(id=product_child_id_param).first()
        cart = Cart.objects.filter(
            user=request.user,
            product_father=product_father,
            product_child=product_child if product_child_id_param else None,
        ).first()

        if not product_child_id_param and product_father is None:
            raise ProductFatherNotFoundError()

        if product_child_id_param and product_child is None:
            raise ProductChildNotFoundError()
        
        if not isinstance(quantity, int):
            raise InvalidQuantitytFormatError()

        if cart is not None:
            cart.quantity = cart.quantity + quantity
            cart.save()
        else:
            Cart.objects.create(
                user=request.user,
                product_father=product_father,
                product_child=product_child if product_child_id_param else None,
                quantity=quantity
            )

        carts = request.user.carts.all()

        # serializing the shopping cart and returning the updated products
        serializer = CartSerializer(carts, many=True, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        print(e)
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    try:
        quantity = request.data.get("quantity")
        cart = request.user.carts.filter(id=pk).first()

        if cart is None:
            raise ShoppingCartNotFoundError()
        
        if not isinstance(quantity, int):
            raise InvalidQuantitytError()
        
        if cart.product_father.has_variations:
            if cart.product_child.quantity < quantity:
                raise InvalidQuantitytError()
        else:
            if cart.product_father.quantity < quantity:
                raise InvalidQuantitytError()
        
        cart.quantity = quantity
        cart.save()
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    except Exception as e:
        print(e)
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    try:
        cart = request.user.carts.filter(id=pk).first()

        if cart is None:
            raise ShoppingCartNotFoundError()
        
        cart.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)