from django.contrib import admin
from .models import ProductComment, StoreComment

# Register your models here.
admin.site.register(ProductComment)
admin.site.register(StoreComment)