from rest_framework.permissions import BasePermission

class IsPaymentGateway(BasePermission):
    def has_permission(self, request, view):
        return True