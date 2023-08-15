from django.db import models

# Create your models here.
class Transaction(models.Model):
    user = models.ForeignKey('users.User', null=True, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.UUIDField(unique=True, null=True)
    gateway_transaction_id = models.CharField(max_length=150, null=True, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    PAYMENT_METHOD_CHOICES = (
        (0, "credit_card"),
        (1, "bol"),
        (2, "pix"),
        (3, "debit_card"),
    )
    payment_method = models.IntegerField(choices=PAYMENT_METHOD_CHOICES, null=True)
    installments = models.IntegerField(null=True)
    STATUS_CHOICES = (
        (0, 'pending'),
        (1, 'approved'),
        (2, 'cancelled'),
    )
    status = models.IntegerField(choices=STATUS_CHOICES)
    products = models.JSONField(null=True)
    gateway_response = models.JSONField(null=True)
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateField(null=True)

    def __str__(self):
        return f'{self.user.email} - {self.transaction_id}'