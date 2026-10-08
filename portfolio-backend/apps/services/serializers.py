from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    features_list = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_features_list(self, obj):
        if obj.features:
            return [f.strip() for f in obj.features.splitlines() if f.strip()]
        return []
