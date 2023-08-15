from django.db import models

# Create your models here.
class GlobalDiscountCoupon(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    code = models.CharField(max_length=150, unique=True)
    PAYMENT_METHOD_CHOICES = (
        (0, "credit_card"),
        (1, "bol"),
        (2, "pix"),
        (3, "debit_card"),
    )
    payment_method = models.IntegerField(null=True, choices=PAYMENT_METHOD_CHOICES)
    accept_already_discounted = models.BooleanField(null=True)
    categories_rule = models.ManyToManyField('categories.CategoryProduct', blank=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def validate_product(self, product_instance, payment_method):
        from transactions.utils import map_payment_method_to_numeric

        if self.payment_method == map_payment_method_to_numeric(payment_method):
            for category_rule in self.categories_rule.all():
                if product_instance.product_father.categories.filter(id=category_rule.id).first() is not None:
                    if product_instance.discount_price is not None and self.accept_already_discounted or product_instance.discount_price is None:
                        return True
        return False

    def __str__(self):
        return f"{self.code}: {self.percentage}%"
    
    def save(self, *args, **kwargs):
        self.code = str(self.code).upper()
        super().save(*args, **kwargs)