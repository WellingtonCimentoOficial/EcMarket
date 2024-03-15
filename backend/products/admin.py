from django.contrib import admin
from .models import (
    ProductFather, ProductChild, ProductPresentation, 
    ProductTechnicalInformation, ProductVariant,
    ProductAttribute, ProductImage
)

# Register your models here.
admin.site.register(ProductFather)
admin.site.register(ProductVariant)
admin.site.register(ProductAttribute)
admin.site.register(ProductImage)
admin.site.register(ProductChild)
admin.site.register(ProductPresentation)
admin.site.register(ProductTechnicalInformation)