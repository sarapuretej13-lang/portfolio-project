from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, SkillCategoryViewSet

router = DefaultRouter()
router.register(r'categories', SkillCategoryViewSet, basename='skill-category')
router.register(r'', SkillViewSet, basename='skill')

urlpatterns = [
    path('', include(router.urls)),
]
