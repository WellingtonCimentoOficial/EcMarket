from rest_framework.exceptions import APIException

class ShoppingCartNotFoundError(APIException):
    status_code = 400
    default_code = 'no_cart'
    default_detail = 'User does not have a shopping cart'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InvalidShoppingCartItemError(APIException):
    status_code = 400
    default_code = 'invalid_cart_item'
    default_detail = 'One of the products is invalid or the quantity is invalid'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class EmptyShoppingCartError(APIException):
    status_code = 400
    default_code = 'empty_cart'
    default_detail = "User's shopping cart is empty"

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail


class ItemNotFoundInCartError(APIException):
    status_code = 404
    default_code = 'item_not_found'
    default_detail = "Product not found in shopping cart"

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InvalidQuantitytError(APIException):
    status_code = 400
    default_code = 'invalid_quantity'
    default_detail = "The quantity to be changed is invalid"

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class DuplicateItemError(APIException):
    status_code = 400
    default_code = 'duplicate_item'
    default_detail = "There are duplicate products"

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail