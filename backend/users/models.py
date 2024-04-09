from django.contrib.auth.models import AbstractUser
from django.db import models
from cart.exceptions import ShoppingCartNotFoundError
from addresses.exceptions import AddressNotFoundError
from django.utils import timezone

class User(AbstractUser):
    username = None
    google_user_id = models.CharField(max_length=255, null=True, unique=True)
    apple_user_id = models.CharField(max_length=255, null=True, unique=True)
    gateway_user_id = models.CharField(max_length=150, null=True)
    first_name = models.CharField(max_length=150, null=False, blank=False)
    last_name = models.CharField(max_length=150, null=False, blank=False)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    id_number = models.CharField(max_length=11, null=True)
    google_password = models.CharField(max_length=128, blank=True, null=True)

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
    
class VerificationCode(models.Model):
    code = models.UUIDField(unique=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='verification_code')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return str(self.code)
    
class PasswordResetCode(models.Model):
    code = models.CharField(max_length=5, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='password_reset_code')
    expiration = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return str(self.code)
    
    def save(self, *args, **kwargs):
        self.created_at = timezone.now()
        self.updated_at = timezone.now()
        self.expiration = self.created_at + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_expired(self):
        return self.expiration < timezone.now()