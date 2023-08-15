from django.contrib import admin
from .models import ProductFather, ProductChild, ProductPresentation, ProductTechnicalInformation

# Register your models here.
admin.site.register(ProductFather)
admin.site.register(ProductChild)
admin.site.register(ProductPresentation)
admin.site.register(ProductTechnicalInformation)