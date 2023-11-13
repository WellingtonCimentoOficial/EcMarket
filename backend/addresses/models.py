from django.db import models

# Create your models here.
class UserAddress(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='address')
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    district = models.CharField(max_length=255)
    complement = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=150)
    uf = models.CharField(max_length=2, null=True)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=2)

    class Meta:
        verbose_name = 'User Adresses'

    def __str__(self):
        return f'{self.street}, {self.number}, {self.complement} - {self.district}, {self.city} - {self.state}, {self.zip_code} - {self.country}'
    
class UserDeliveryAddress(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='delivery_addresses')
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    district = models.CharField(max_length=255)
    complement = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=150)
    uf = models.CharField(max_length=2, null=True)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=2)

    class Meta:
        verbose_name = 'User Delivery Adresses'

    def __str__(self):
        return f'{self.street}, {self.number}, {self.complement} - {self.district}, {self.city} - {self.state}, {self.zip_code} - {self.country}'
    
class StoreAddress(models.Model):
    user = models.OneToOneField('stores.Store', on_delete=models.CASCADE, related_name='address')
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    district = models.CharField(max_length=255)
    complement = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=150)
    uf = models.CharField(max_length=2, null=True)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=2)

    class Meta:
        verbose_name = 'Store Adresses'

    def __str__(self):
        return f'{self.street}, {self.number}, {self.complement} - {self.district}, {self.city} - {self.state}, {self.zip_code} - {self.country}'