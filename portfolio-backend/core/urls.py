"""
Portfolio CMS — Root URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Django Admin (dev use only)
    path('django-admin/', admin.site.urls),

    # OpenAPI schema & docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Authentication
    path('api/auth/', include('apps.authentication.urls')),

    # CMS Content APIs
    path('api/about/', include('apps.about.urls')),
    path('api/skills/', include('apps.skills.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/blogs/', include('apps.blogs.urls')),
    path('api/experience/', include('apps.experience.urls')),
    path('api/testimonials/', include('apps.testimonials.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/contact/', include('apps.contact.urls')),
    path('api/media/', include('apps.media.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
