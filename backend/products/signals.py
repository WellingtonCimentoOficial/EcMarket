from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from .models import ProductFather, ProductChild
from django.db.models import ImageField
from django.conf import settings
import os

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

@receiver(pre_save, sender=ProductFather)
def check_has_variations(sender, instance, **kwargs):
    if instance.pk:
        old_instance = ProductFather.objects.get(pk=instance.pk)
        if old_instance.has_variations != instance.has_variations:
            instance.has_variations = old_instance.has_variations