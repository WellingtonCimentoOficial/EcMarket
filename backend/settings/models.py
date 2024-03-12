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
    company_choices = (
        (0, 'whatsapp'),
        (1, 'instagram'),
        (2, 'facebook'),
        (3, 'twitter'),
    )
    company = models.IntegerField(null=True, choices=company_choices)
    profile_name = models.CharField(max_length=255, null=True)
    url = models.CharField(max_length=255, null=True)

    def __str__(self):
        return dict(self.company_choices).get(self.company)
    
    def save(self, *args, **kwargs):
        existing_item = SocialMediaSetting.objects.filter(company=self.company).first()
        if existing_item:
            self.pk = existing_item.pk
            existing_item.delete()

        super().save(*args, **kwargs)