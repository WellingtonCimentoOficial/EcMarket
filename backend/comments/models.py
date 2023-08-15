from django.db import models

# Create your models here.
class ProductComment(models.Model):
    product = models.ForeignKey('products.ProductFather', on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='product_comments')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.comment
    
class StoreComment(models.Model):
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='store_comments')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.comment