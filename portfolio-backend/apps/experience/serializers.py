from rest_framework import serializers
from .models import Experience


class ExperienceSerializer(serializers.ModelSerializer):
    company_logo_url = serializers.SerializerMethodField()
    technologies_list = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = '__all__'

    def get_company_logo_url(self, obj):
        request = self.context.get('request')
        if obj.company_logo and request:
            return request.build_absolute_uri(obj.company_logo.url)
        return None

    def get_technologies_list(self, obj):
        if obj.technologies:
            return [t.strip() for t in obj.technologies.split(',') if t.strip()]
        return []

    def get_duration(self, obj):
        from django.utils import timezone
        end = obj.end_date if obj.end_date else timezone.now().date()
        months = (end.year - obj.start_date.year) * 12 + (end.month - obj.start_date.month)
        years = months // 12
        remaining_months = months % 12
        parts = []
        if years > 0:
            parts.append(f"{years} yr{'s' if years > 1 else ''}")
        if remaining_months > 0:
            parts.append(f"{remaining_months} mo{'s' if remaining_months > 1 else ''}")
        return ' '.join(parts) if parts else '< 1 mo'
