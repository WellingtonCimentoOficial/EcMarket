from django.db import models

# Create your models here.
class BasicSetting(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if BasicSetting.objects.exists():
            return
        super().save(*args, **kwargs)
    
class SocialMediaSetting(models.Model):
    whatsapp_profile = models.CharField(max_length=255, null=True, blank=True)
    whatsapp_url = models.CharField(max_length=255, null=True, blank=True)

    instagram_profile = models.CharField(max_length=255, null=True, blank=True)
    instagram_url = models.CharField(max_length=255, null=True, blank=True)

    facebook_profile = models.CharField(max_length=255, null=True, blank=True)
    facebook_url = models.CharField(max_length=255, null=True, blank=True)

    twitter_profile = models.CharField(max_length=255, null=True, blank=True)
    twitter_url = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.instagram_profile
    
    def save(self, *args, **kwargs):
        if SocialMediaSetting.objects.exists():
            return
        super().save(*args, **kwargs)