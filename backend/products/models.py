from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_delete
from django.db.models import ImageField
from django.conf import settings
import os

# Create your models here.
class ProductImage(models.Model):
    name = models.CharField(max_length=255)
    principal_image = models.ImageField(upload_to='static/images/', null=True)
    image_2 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    image_4 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    image_5 = models.ImageField(upload_to='static/product/images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class ProductFather(models.Model):
    name = models.CharField(max_length=255)
    weight = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    height = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    length = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    description = models.TextField()
    categories = models.ManyToManyField('categories.CategoryProduct')
    brand = models.ForeignKey('brands.ProductBrand', on_delete=models.CASCADE, related_name="products", null=True, blank=True)
    default_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True)
    images = models.ForeignKey(ProductImage, on_delete=models.CASCADE, null=True, blank=True)
    has_variations = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def discount_percentage(self):
        if self.discount_price is not None and self.discount_price < self.default_price:
            calc = ((self.default_price - self.discount_price) / self.default_price) * 100
            return round(calc, 2)
        return None
    
    
class ProductAttribute(models.Model):
    name = models.CharField(max_length=255)
    is_image_field = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class ProductVariant(models.Model):
    product_father = models.ForeignKey(ProductFather, on_delete=models.CASCADE, null=True, related_name="variants")
    attribute = models.ForeignKey(ProductAttribute, on_delete=models.CASCADE, null=True)
    description = models.CharField(max_length=255)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.attribute} {self.description}"
    
    def save(self, *args, **kwargs):
        if self.is_primary:
            variants = self.product_father.variants.filter(is_primary=True)
            if variants.exists():
                variants.update(is_primary=False)
        super().save(*args, **kwargs)
    

class ProductChild(models.Model):
    sku = models.CharField(max_length=255, null=True, blank=True)
    product_variant = models.ManyToManyField(ProductVariant, related_name="children")
    default_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.IntegerField()
    images = models.ForeignKey(ProductImage, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def discount_percentage(self):
        if self.discount_price is not None and self.discount_price < self.default_price:
            calc = ((self.default_price - self.discount_price) / self.default_price) * 100
            return round(calc, 2)
        return None
    
    def __str__(self):
        if self.product_variant.exists():
            variants = self.product_variant.all()
            attributes = list(variants.values_list('attribute__name', 'description'))
            attributes_formated = ''.join([f'{item[0]}: {item[1]} | ' for item in attributes])
            return f'{self.product_variant.first().product_father.name} - {attributes_formated}'
        return "Empty Variant"
    
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
    image_6 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_7 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_8 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_9 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)
    image_10 = models.ImageField(upload_to='static/product/presentation/', null=True, blank=True)

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