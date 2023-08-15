from django.db import models
from .exceptions import EmptyShoppingCartError

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField('users.User', null=True, on_delete=models.CASCADE, related_name="cart")
    products = models.JSONField(null=True, blank=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email

    def is_full(self):
        cart_products = self.products or []
        if len(cart_products) > 0:
            return True
        raise EmptyShoppingCartError()
    