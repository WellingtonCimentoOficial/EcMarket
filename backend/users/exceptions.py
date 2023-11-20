from rest_framework.exceptions import APIException

class UserAlreadyExists(APIException):
    status_code = 401
    default_code = 'user_already_exists'
    default_detail = 'User alredy exists'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InvalidGoogleToken(APIException):
    status_code = 401
    default_code = 'invalid_google_token'
    default_detail = 'The google token is invalid'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class InternalError(APIException):
    status_code = 500
    default_code = 'internal_error'
    default_detail = 'An internal error occurred'