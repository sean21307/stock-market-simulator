from rest_framework import serializers
from .models import ForumPost, ForumComment

class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'upvotes', 'user']

class ForumCommentSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=ForumPost.objects.all())

    class Meta:
        model = ForumComment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'upvotes', 'user', 'post']