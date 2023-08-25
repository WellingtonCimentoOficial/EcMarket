from rest_framework.exceptions import APIException

class CategoryFilterError(APIException):
    status_code = 400
    default_code = 'category_filter_invalid'
    default_detail = 'Invalid category filter'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail