from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.permissions import IsAdminOrReadOnly
from .models import Blog, BlogCategory
from .serializers import BlogSerializer, BlogCategorySerializer


class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class BlogViewSet(viewsets.ModelViewSet):
    serializer_class = BlogSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'featured', 'category']
    search_fields = ['title', 'excerpt', 'content', 'tags']
    ordering_fields = ['created_at', 'published_at', 'views', 'title']
    lookup_field = 'slug'

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Blog.objects.select_related('category', 'author').all()
        return Blog.objects.select_related('category', 'author').filter(status='published')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'], permission_classes=[])
    def increment_views(self, request, slug=None):
        """POST /api/blogs/{slug}/increment_views/ — Increment view count."""
        blog = self.get_object()
        blog.views += 1
        blog.save(update_fields=['views'])
        return Response({'views': blog.views})
