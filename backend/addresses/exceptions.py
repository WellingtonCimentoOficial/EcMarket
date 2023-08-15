from rest_framework.exceptions import APIException

class AddressNotFoundError(APIException):
    status_code = 400
    default_code = 'no_address'
    default_detail = 'User does not have a registered address'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InvalidAddressError(APIException):
    status_code = 400
    default_code = 'invalid_address'
    default_detail = 'The address is invalid'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class DeliveryAddressNotFoundError(APIException):
    status_code = 400
    default_code = 'no_delivery_address'
    default_detail = 'User does not have a registered delivery address'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InvalidDeliveryAddressError(APIException):
    status_code = 400
    default_code = 'invalid_delivery_address'
    default_detail = 'The delivery address is invalid'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail