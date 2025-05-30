from django.db import models
from django.contrib.auth.models import User

class ForumPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    upvotes = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_posts')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Forum Post'
        verbose_name_plural = 'Forum Posts'

    def __str__(self):
        return f"{self.title} by {self.user.username}"


class ForumComment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    upvotes = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_comments')
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Forum Comment'
        verbose_name_plural = 'Forum Comments'

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"