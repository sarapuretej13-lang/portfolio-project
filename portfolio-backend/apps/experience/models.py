from django.db import models


class Experience(models.Model):
    TYPE_CHOICES = [
        ('work', 'Work Experience'),
        ('education', 'Education'),
        ('volunteer', 'Volunteer'),
        ('certification', 'Certification'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='work')
    company = models.CharField(max_length=200, help_text="Company or Institution name")
    position = models.CharField(max_length=200, help_text="Job title or Degree")
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    company_logo = models.ImageField(upload_to='experience/', blank=True, null=True)
    company_url = models.URLField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True, help_text="Leave blank if current")
    is_current = models.BooleanField(default=False)
    technologies = models.CharField(max_length=500, blank=True, help_text="Comma-separated")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_current', '-start_date', 'display_order']

    def __str__(self):
        return f"{self.position} at {self.company}"
