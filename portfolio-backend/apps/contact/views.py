from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.permissions import IsAdmin
from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactCreateSerializer


class ContactView(APIView):
    """
    POST /api/contact/ — Public endpoint to send a contact message.
    Saves to DB and sends email notification.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get IP address
        ip = (
            request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
            or request.META.get('REMOTE_ADDR')
        )

        message_obj = serializer.save(ip_address=ip)

        # Send email notification
        try:
            send_mail(
                subject=f"[Portfolio Contact] {message_obj.subject or 'New Message'} from {message_obj.name}",
                message=(
                    f"Name: {message_obj.name}\n"
                    f"Email: {message_obj.email}\n"
                    f"Subject: {message_obj.subject}\n\n"
                    f"Message:\n{message_obj.message}\n\n"
                    f"---\nIP: {ip}\nSent at: {message_obj.created_at}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=True,  # Don't crash if email fails
            )
        except Exception:
            pass  # Email failure should not block the response

        return Response(
            {'message': 'Your message has been sent successfully. I will get back to you soon!'},
            status=status.HTTP_201_CREATED
        )


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    Admin-only: list, read, update status, delete contact messages.
    GET    /api/contact/messages/
    GET    /api/contact/messages/{id}/
    PATCH  /api/contact/messages/{id}/
    DELETE /api/contact/messages/{id}/
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdmin]
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
