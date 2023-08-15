from django.contrib.auth.models import AbstractUser
from django.db import models
from cart.exceptions import ShoppingCartNotFoundError
from addresses.exceptions import AddressNotFoundError

class User(AbstractUser):
    username = None
    gateway_user_id = models.CharField(max_length=150, null=True)
    first_name = models.CharField(max_length=150, null=False, blank=False)
    last_name = models.CharField(max_length=150, null=False, blank=False)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def has_shopping_cart(self):
        if hasattr(self, 'cart'):
            return True
        raise ShoppingCartNotFoundError()
    
    def has_address(self):
        if hasattr(self, 'address'):
            return True
        raise AddressNotFoundError()