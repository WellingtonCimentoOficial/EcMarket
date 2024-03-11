from django.contrib import admin
from .models import CategoryProduct, SubCategoryProduct

# Register your models here.
admin.site.register(CategoryProduct)
admin.site.register(SubCategoryProduct)