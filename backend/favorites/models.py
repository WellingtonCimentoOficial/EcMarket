from django.db import models

# Create your models here.
class Favorite(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name="favorite")
    products = models.ManyToManyField('products.ProductFather', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email