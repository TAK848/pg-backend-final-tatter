from django.contrib import admin

from .models import Tart


class TartAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
            'fields': (
                'id',
                'user',
                'text',
                'created_at',
                'updated_at',
                'was_edited',
                'was_deleted',
            )
        }),
    )
    readonly_fields = (
        'id',
        'created_at',
        'updated_at',
    )
    list_display = (
        'user',
        'text',
        'created_at',
        'updated_at',
        'was_edited',
        'was_deleted',
    )
    ordering = ('-created_at', 'id',)


admin.site.register(Tart, TartAdmin)
