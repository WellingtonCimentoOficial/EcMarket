from rest_framework.exceptions import APIException

class ProductNotFoundError(APIException):
    status_code = 400
    default_code = 'product_not_found'
    default_detail = 'Product not found'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail