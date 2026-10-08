from django.contrib import admin
from .models import Blog, BlogCategory

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'featured', 'views', 'created_at')
    list_filter = ('status', 'featured', 'category')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'content')
