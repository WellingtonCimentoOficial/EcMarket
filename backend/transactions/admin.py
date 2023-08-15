from django.contrib import admin
from .models import Transaction

# Register your models here.
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "transaction_id", "gateway_transaction_id", "amount", "payment_method", "installments", "status")
admin.site.register(Transaction, TransactionAdmin)