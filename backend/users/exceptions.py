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

class InvalidFirstNameFormat(APIException):
    status_code = 400
    default_code = 'Invalid_first_name_format'
    default_detail = 'Invalid first name format'

class InvalidLastNameFormat(APIException):
    status_code = 400
    default_code = 'Invalid_last_name_format'
    default_detail = 'Invalid last name format'

class InvalidEmailFormat(APIException):
    status_code = 400
    default_code = 'Invalid_email_format'
    default_detail = 'Invalid email format'

class InvalidPasswordFormat(APIException):
    status_code = 400
    default_code = 'Invalid_password_format'
    default_detail = 'Invalid password format'

class EmailAlreadyUsed(APIException):
    status_code = 400
    default_code = 'email_already_used'
    default_detail = 'The email is already being used'

class TermsNotAccepted(APIException):
    status_code = 400
    default_code = 'terms_not_accepted'
    default_detail = 'Terms of use and privacy I do not accept'

class ErrorCreatingVerificationCode(APIException):
    status_code = 400
    default_code = 'error_creating_verification_code'
    default_detail = 'Error creating verificationCcode'

class InvalidVerificationCodeFormat(APIException):
    status_code = 400
    default_code = 'invalid_verifiction_code_format'
    default_detail = 'The verification code format is invalid'

class InvalidVerificationCode(APIException):
    status_code = 400
    default_code = 'invalid_verification_code'
    default_detail = 'The verification code is invalid'

class ExpiredVerificationCode(APIException):
    status_code = 400
    default_code = 'expired_verification_code'
    default_detail = 'The verification code is expired'

class AccountAlreadyVerified(APIException):
    status_code = 400
    default_code = 'account_already_verified'
    default_detail = 'The account has already been verified'

class VerificationCodeNotFound(APIException):
    status_code = 400
    default_code = 'verification_code_not_found'
    default_detail = 'Verification code not found'
    
class ErrorCreatingPasswordResetCode(APIException):
    status_code = 500
    default_code = 'error_creating_password_reset_code'
    default_detail = 'Error creating password reset code'

class InvalidPasswordResetCodeFormat(APIException):
    status_code = 400
    default_code = 'invalid_password_reset_code_format'
    default_detail = 'Invalid password reset code format'
    
class ExpiredPasswordResetCode(APIException):
    status_code = 401
    default_code = 'expired_password_reset_code'
    default_detail = 'The password reset code is expired'

class UserNotFound(APIException):
    status_code = 404
    default_code = 'user_not_found'
    default_detail = 'The user was not found'

class InvalidAuthenticationMethod(APIException):
    status_code = 400
    default_code = 'invalid_authentication_method'
    default_detail = 'The authentication method is invalid'