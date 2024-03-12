from django.contrib import admin
from .models import BasicSetting, SocialMediaSetting

# Register your models here.
admin.site.register(BasicSetting)
admin.site.register(SocialMediaSetting)