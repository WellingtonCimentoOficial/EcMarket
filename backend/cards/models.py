from django.db import models

# Create your models here.
class Card(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='cards')
    nickname = models.CharField(max_length=255, null=True, blank=True)
    gateway_card_id = models.CharField(max_length=100, null=True, unique=True)
    first_six_digits = models.CharField(max_length=6, null=True)
    last_four_digits = models.CharField(max_length=4, null=True)
    expiration_month = models.CharField(max_length=2, null=True)
    expiration_year = models.CharField(max_length=4, null=True)
    cardholder_name = models.CharField(max_length=150, null=True)
    cardholder_document_number = models.CharField(max_length=14, null=True)
    cardholder_document_type = models.CharField(max_length=4, null=True)
    paymentmethod_name = models.CharField(max_length=50, null=True)
    paymentmethod_id = models.CharField(max_length=50, null=True)
    paymentmethod_type_id = models.CharField(max_length=50, null=True)
    secutirycode_length = models.IntegerField(null=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        if self.nickname:
            return f'{self.user.email} - {self.nickname}: {self.first_six_digits}******{self.last_four_digits}'
        return f'{self.user.email} - {self.first_six_digits}******{self.last_four_digits}'