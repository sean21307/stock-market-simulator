from django.urls import path
from . import views

app_name = "api/forum"

urlpatterns = [

    # Post operations
    path('posts/', views.get_forum_posts, name="forum-posts"),
    path('posts/create/', views.create_forum_post, name="create-forum-post"),
    path('posts/<int:post_id>/', views.get_single_post, name="get-single-post"),
    path('posts/<int:post_id>/update/', views.update_forum_post, name="update-forum-post"),
    path('posts/<int:post_id>/delete/', views.delete_forum_post, name="delete-forum-post"),
    path('posts/<int:post_id>/upvote/', views.upvote_post, name="upvote-post"),

    # Comment operations (board-specific)
    path('posts/<int:post_id>/comments/', views.get_post_comments, name="post-comments"),
    path('posts/<int:post_id>/comments/create/', views.create_comment, name="create-comment"),
    path('posts/<int:post_id>/comments/<int:comment_id>/', views.get_single_comment,
         name="get-single-comment"),
    path('posts/<int:post_id>/comments/<int:comment_id>/update/', views.update_comment,
         name="update-comment"),
    path('posts/<int:post_id>/comments/<int:comment_id>/delete/', views.delete_comment,
         name="delete-comment"),
    path('posts/<int:post_id>/comments/<int:comment_id>/upvote/', views.upvote_comment,
         name="upvote-comment"),
]