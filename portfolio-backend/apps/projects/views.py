from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.permissions import IsAdminOrReadOnly
from .models import Project, ProjectTag
from .serializers import ProjectSerializer, ProjectTagSerializer


class ProjectTagViewSet(viewsets.ModelViewSet):
    queryset = ProjectTag.objects.all()
    serializer_class = ProjectTagSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'featured']
    search_fields = ['title', 'description', 'tech_stack']
    ordering_fields = ['display_order', 'created_at', 'title']
    lookup_field = 'slug'

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Project.objects.prefetch_related('tags').all()
        return Project.objects.prefetch_related('tags').filter(status='published')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
