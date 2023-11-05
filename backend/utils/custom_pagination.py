from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

class CustomPagination(LimitOffsetPagination):
    PAGE_SIZE = 5
    default_limit = 5
    max_limit = 100

    def get_paginated_response(self, data):
        return Response({
            'total_item_count': self.count,
            'total_page_count': self.count // self.limit + (1 if self.count % self.limit else 0),
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })