from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.permissions import IsAdminOrReadOnly
from .models import Experience
from .serializers import ExperienceSerializer


class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'type', 'is_current']
    search_fields = ['company', 'position', 'description']
    ordering_fields = ['start_date', 'display_order']

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Experience.objects.all()
        return Experience.objects.filter(status='published')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
