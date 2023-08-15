from django.contrib import admin
from .models import Address, DeliveryAddress

# Register your models here.
class AddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'number', 'district', 'complement', 'city', 'state', 'uf', 'zip_code', 'country')
    
class DeliveryAddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'number', 'district', 'complement', 'city', 'state', 'uf', 'zip_code', 'country')

admin.site.register(Address, AddressAdmin)
admin.site.register(DeliveryAddress, DeliveryAddressAdmin)