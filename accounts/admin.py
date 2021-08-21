from allauth.account.models import EmailAddress
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from .models import CustomUser


class EmailInline(admin.TabularInline):
    model = EmailAddress
    can_delete = False


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {
            'fields': (
                'uuid',
                'email',
                'username',
                'changed_initial_username',
                'password',
            )
        }),
        ('ユーザー基本情報', {
            'fields': (
                'handle_name',
                'display_username',
                'biography',
                'tart_is_private',
                'account_is_hidden',
            )
        }),
        ('状態', {
            'fields': (
                'is_active',
                'last_login',
            )
        }),
        ('権限', {
            'fields': (
                'is_staff',
                'is_superuser',
                'user_permissions',
                'groups',
            )
        }),
        ('付加情報', {
            'fields': (
                'date_joined',
            ),
        }),
    )
    readonly_fields = (
        'uuid',
        'username',
        'date_joined',
    )
    list_display = (
        'display_username',
        'username',
        'handle_name',
        'email',
        'is_active',
        'is_superuser',
    )
    inlines = [EmailInline]


admin.site.unregister(Group)
admin.site.register(CustomUser, CustomUserAdmin)
