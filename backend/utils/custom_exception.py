from rest_framework.exceptions import APIException

class CustomAPIException(APIException):
    def get_full_details(self):
        details = super().get_full_details()
        details['code'] = getattr(self, 'default_code', None)

        return details