from django.contrib import admin
from .models import Experience

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('position', 'company', 'type', 'start_date', 'is_current', 'status')
    list_filter = ('type', 'status', 'is_current')
