from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CategoryProduct, SubCategoryProduct

@receiver(post_save, sender=CategoryProduct)
def create_default_sub_category_product(sender, instance, created, **kwargs):
    if created:
        try:
            SubCategoryProduct.objects.create(category_product=instance, name=f"Tudo em {instance.name}")
        except:
            pass