from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.permissions import IsAdminOrReadOnly
from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'featured']
    ordering_fields = ['display_order', 'created_at', 'rating']

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(status='published')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
