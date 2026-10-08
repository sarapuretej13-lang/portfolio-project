from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactView, ContactMessageViewSet

router = DefaultRouter()
router.register(r'messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('', ContactView.as_view(), name='contact'),
    path('', include(router.urls)),
]
