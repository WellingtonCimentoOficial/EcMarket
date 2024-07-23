from django.db import models

# Create your models here.
class HomeBanner(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='static/banner/images/', null=True)
    url = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title