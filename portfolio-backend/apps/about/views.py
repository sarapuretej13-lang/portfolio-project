from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.permissions import IsAdminOrReadOnly
from .models import About
from .serializers import AboutSerializer


class AboutView(APIView):
    """
    GET  /api/about/   — public, returns the about data
    POST /api/about/   — admin only, create (only if none exists)
    PUT  /api/about/   — admin only, update existing
    """
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        about = About.objects.first()
        if not about:
            return Response({'detail': 'About data not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AboutSerializer(about, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if About.objects.exists():
            return Response(
                {'detail': 'About record already exists. Use PUT to update.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = AboutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        about = About.objects.first()
        if not about:
            # Auto-create if doesn't exist yet
            serializer = AboutSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        serializer = AboutSerializer(about, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
