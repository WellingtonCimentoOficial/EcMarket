import requests
import os
from rest_framework.exceptions import APIException

secret = os.getenv("RECAPTCHA_SECRET")

class InvalidReCaptchaToken(APIException):
    status_code = 401
    default_code = 'invalid_recaptcha_token'
    default_detail = 'Invalid ReCaptcha Token'

class ReCaptcha:
    def __init__(self, token):
        self.url_base = "https://www.google.com/recaptcha/api/siteverify"
        self.secret = secret
        self.token = token

    def validate_token(self):
        response = requests.post(self.url_base, data={"secret": self.secret,"response": self.token})
        if response.status_code == 200 and response.json().get("success"):
            return True
        raise InvalidReCaptchaToken