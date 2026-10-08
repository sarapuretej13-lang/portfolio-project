from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.permissions import IsAdminOrReadOnly
from .models import Skill, SkillCategory
from .serializers import SkillSerializer, SkillCategorySerializer


class SkillCategoryViewSet(viewsets.ModelViewSet):
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'proficiency']
    search_fields = ['name']
    ordering_fields = ['display_order', 'name', 'created_at']

    def get_queryset(self):
        # Public: only published; Admin: all
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Skill.objects.select_related('category').all()
        return Skill.objects.select_related('category').filter(status='published')
