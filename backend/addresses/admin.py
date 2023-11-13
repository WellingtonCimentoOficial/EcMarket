from django.contrib import admin
from .models import UserAddress, UserDeliveryAddress, StoreAddress

# Register your models here.
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'number', 'district', 'complement', 'city', 'state', 'uf', 'zip_code', 'country')
    
class UserDeliveryAddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'number', 'district', 'complement', 'city', 'state', 'uf', 'zip_code', 'country')

class StoreAddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'number', 'district', 'complement', 'city', 'state', 'uf', 'zip_code', 'country')

admin.site.register(UserAddress, UserAddressAdmin)
admin.site.register(UserDeliveryAddress, UserDeliveryAddressAdmin)
admin.site.register(StoreAddress, StoreAddressAdmin)