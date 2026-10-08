from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('status', 'ip_address', 'created_at')


class ContactCreateSerializer(serializers.ModelSerializer):
    """Used for public POST — limits fields the user can set."""
    class Meta:
        model = ContactMessage
        fields = ('name', 'email', 'subject', 'message')

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value
