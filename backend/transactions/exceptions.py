from rest_framework.exceptions import APIException

class InvalidPaymentMethodError(APIException):
    status_code = 400
    default_code = 'invalid_payment_method'
    default_detail = 'The chosen payment method is invalid'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InvalidTransactionError(APIException):
    status_code = 400
    default_code = 'invalid_transaction'
    default_detail = 'Invalid transaction'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InvalidTransactionStatusError(APIException):
    status_code = 400
    default_code = 'invalid_transaction_status'
    default_detail = 'Transaction status is invalid'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail
        
class InternalError(APIException):
    status_code = 500
    default_code = 'internal_error'
    default_detail = 'An internal error occurred'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class UnauthorizedProductPurchaseError(APIException):
    status_code = 401
    default_code = 'unauthorized_product_purchase_error'
    default_detail = 'Unauthorized purchase'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail