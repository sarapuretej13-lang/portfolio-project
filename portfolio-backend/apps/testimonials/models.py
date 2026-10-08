from django.db import models


class Testimonial(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200, blank=True, help_text="e.g. CEO at Company")
    company = models.CharField(max_length=200, blank=True)
    avatar = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5, help_text="1-5 stars")
    linkedin_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', 'display_order', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.company}"
