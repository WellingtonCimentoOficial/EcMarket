from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_delete
from django.db.models import ImageField
from django.conf import settings
import os

# Create your models here.
class ProductFather(models.Model):
    name = models.CharField(max_length=255)
    shipping_weight = models.DecimalField(max_digits=3, decimal_places=2, null=True)
    shipping_width = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    shipping_height = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    shipping_length = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    description = models.TextField()
    categories = models.ManyToManyField('categories.CategoryProduct')
    brand = models.ForeignKey('brands.ProductBrand', on_delete=models.CASCADE, related_name="products", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductChild(models.Model):
    sku = models.CharField(max_length=255, null=True, blank=True)
    product_father = models.ForeignKey(ProductFather, on_delete=models.CASCADE, related_name='children')
    default_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.IntegerField()
    principal_image = models.ImageField(upload_to='static/images/', null=True)
    image_2 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def discount_percentage(self):
        if self.discount_price is not None and self.discount_price < self.default_price:
            calc = ((self.default_price - self.discount_price) / self.default_price) * 100
            return round(calc, 2)
        return None
    
    def __str__(self):
        return self.product_father.name
    
@receiver(pre_delete, sender=ProductChild)
def delete_product_child_images(sender, instance, **kwargs):
    fields = instance._meta.get_fields()

    for field in fields:
        if isinstance(field, ImageField):
            image = getattr(instance, field.name)
            if image:
                try:
                    image_path = os.path.join(settings.MEDIA_ROOT, str(image))
                    os.remove(image_path)
                except:
                    print("imagem não deletada")


class ProductPresentation(models.Model):
    product = models.OneToOneField(ProductFather, on_delete=models.CASCADE, related_name='presentation')
    image_1 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_2 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)

    def __str__(self):
        return self.product.name
    
class ProductTechnicalInformation(models.Model):
    product = models.ForeignKey(ProductFather, on_delete=models.CASCADE, related_name='technical_information')
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.product} | {self.name}'