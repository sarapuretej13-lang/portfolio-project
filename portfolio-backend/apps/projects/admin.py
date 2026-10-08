from django.contrib import admin
from .models import Project, ProjectTag

@admin.register(ProjectTag)
class ProjectTagAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'featured', 'status', 'display_order', 'created_at')
    list_filter = ('status', 'featured')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'description')
