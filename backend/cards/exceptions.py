from rest_framework.exceptions import APIException

class InvalidCardPayloadDataError(APIException):
    status_code = 400
    default_code = 'invalid_card_payload_data'
    default_detail = 'Card payload data is invalid'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class CardNotFoundError(APIException):
    status_code = 400
    default_code = 'card_not_found'
    default_detail = 'Card not found'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail