from django.db import models


class About(models.Model):
    """
    Singleton-style model — only one About record per portfolio.
    """
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, help_text="e.g. Full Stack Developer")
    bio = models.TextField()
    short_bio = models.CharField(max_length=500, blank=True)
    profile_image = models.ImageField(upload_to='about/', blank=True, null=True)
    resume = models.FileField(upload_to='resume/', blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=200, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    available_for_hire = models.BooleanField(default=True)

    # Social links
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True, help_text="Internshala profile URL")
    website_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'About'
        verbose_name_plural = 'About'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Enforce singleton — only one About record allowed
        if not self.pk and About.objects.exists():
            # Update existing record instead of creating a new one
            existing = About.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)
