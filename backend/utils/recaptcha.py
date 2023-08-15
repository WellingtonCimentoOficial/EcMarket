import requests
import os

secret = os.getenv("RECAPTCHA_SECRET")

class ReCaptcha:
    def __init__(self, token):
        self.url_base = "https://www.google.com/recaptcha/api/siteverify"
        self.secret = secret
        self.token = token

    def validate_token(self):
        response = requests.post(self.url_base, data={"secret": self.secret,"response": self.token})
        if response.status_code == 200 and response.json().get("success"):
            return True
        return False