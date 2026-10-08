from rest_framework import serializers
from .models import Project, ProjectTag


class ProjectTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTag
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    tags = ProjectTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ProjectTag.objects.all(),
        write_only=True, source='tags', required=False
    )
    thumbnail_url = serializers.SerializerMethodField()
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None

    def get_tech_stack_list(self, obj):
        if obj.tech_stack:
            return [t.strip() for t in obj.tech_stack.split(',') if t.strip()]
        return []
