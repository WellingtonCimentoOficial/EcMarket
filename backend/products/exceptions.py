from rest_framework.exceptions import APIException

class ProductFatherNotFoundError(APIException):
    status_code = 400
    default_code = 'product_father_not_found'
    default_detail = 'Product father not found'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class ProductChildNotFoundError(APIException):
    status_code = 400
    default_code = 'product_child_not_found'
    default_detail = 'Product child not found'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class ProductFilterError(APIException):
    status_code = 400
    default_code = 'product_filter_invalid'
    default_detail = 'Invalid product filter'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail