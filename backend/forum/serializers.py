from rest_framework import serializers
from .models import ForumPost, ForumComment

class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'upvotes', 'user']

class ForumCommentSerializer(serializers.ModelSerializer):
    postId = serializers.IntegerField(source='post.id', read_only=True)

    class Meta:
        model = ForumComment
        fields = ['id', 'user', 'content', 'post', 'postId', 'created_at', 'upvotes']
        read_only_fields = ['id', 'created_at', 'upvotes', 'user', 'post']