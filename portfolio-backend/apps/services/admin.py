from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'featured', 'status', 'display_order')
    list_filter = ('status', 'featured')
