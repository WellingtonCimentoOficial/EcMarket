from django.db import models

# Create your models here.
class Favorite(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name="favorite")
    product_fathers = models.ManyToManyField('products.ProductFather', blank=True)
    product_childs = models.ManyToManyField('products.ProductChild', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        product_fathers_to_add = kwargs.pop('product_fathers_to_add', None)
        product_childs_to_add = kwargs.pop('product_childs_to_add', None)

        super().save(*args, **kwargs)

        if product_fathers_to_add:
            for product_father in product_fathers_to_add:
                if not product_father.has_variations:
                    self.product_fathers.add(product_father)

        if product_childs_to_add:
            for product_child in product_childs_to_add:
                if not product_child.product_variant.first().product_father in self.product_fathers.all():
                    self.product_childs.add(product_child)

    def __str__(self):
        return self.user.email