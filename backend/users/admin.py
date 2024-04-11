from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, VerificationCode


class UserAdmin(BaseUserAdmin):
    readonly_fields = ('google_password', 'google_user_id', 'gateway_user_id')
    fieldsets = (
        ('Default Auth', {'fields': ('email', 'password')}),
        ('Google Auth', {'fields': ('google_user_id', 'google_password')}),
        ('Gateway Info', {'fields': ('gateway_user_id',)}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'id_number')}),
        ('Verification', {'fields': ('is_verified',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_display = ("email", "first_name", "last_name", "is_staff")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("email", "first_name", "last_name", "email")
    ordering = ("email",)

class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "created_at", "updated_at")

admin.site.register(User, UserAdmin)
admin.site.register(VerificationCode, VerificationCodeAdmin)