from django.contrib import admin
from .models import Skill, SkillCategory

@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_order')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'status', 'display_order')
    list_filter = ('status', 'proficiency', 'category')
