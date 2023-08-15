from django.db import models

# Create your models here.
class Order(models.Model):
    order_id = models.CharField(max_length=50)
    STATUS_CHOICES = (
        (0, 'cancelled'),
        (1, 'approved'),
        (2, 'pending'),
    )
    
    status = models.IntegerField(choices=STATUS_CHOICES)
    created_at = models.DateTimeField()
    updated_at = models.DateField()

    def __str__(self):
        return f'{self.order_id} - {self.status}'