from django.db import models


class SkillCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Skill Categories'
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class Skill(models.Model):
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        SkillCategory, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='skills'
    )
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES, default='intermediate')
    proficiency_percentage = models.PositiveIntegerField(default=80, help_text="0-100")
    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or name, e.g. devicon-python")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_proficiency_display()})"
