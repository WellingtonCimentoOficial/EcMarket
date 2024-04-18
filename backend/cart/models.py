from django.db import models
from .exceptions import EmptyShoppingCartError, ProductFatherMismatchError, InvalidQuantitytError

# Create your models here.
class Cart(models.Model):
    user = models.ForeignKey('users.User', null=True, on_delete=models.CASCADE, related_name="carts")
    product_father = models.ForeignKey('products.ProductFather', on_delete=models.CASCADE, related_name="carts")
    product_child = models.ForeignKey('products.ProductChild', null=True, on_delete=models.CASCADE, related_name="carts")
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
    
    def save(self, *args, **kwargs):
        if self.product_child and self.product_father != self.product_child.product_variant.first().product_father:
            raise ProductFatherMismatchError()
        if self.quantity <= 0:
            raise InvalidQuantitytError()
        super().save(*args, **kwargs)

    def is_full(self):
        # cart_products = self.products or []
        # if len(cart_products) > 0:
        #     return True
        raise EmptyShoppingCartError()
    