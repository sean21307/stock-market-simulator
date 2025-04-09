from django.urls import path
from . import views

app_name = "forum"

urlpatterns = [
    path('', views.get_forum_posts, name="forum-posts"),
    path('new', views.create_forum_post, name="create-forum-post"),
    path("<int:post_id>/update", views.update_forum_post, name="update-forum-post"),
    path("<int:post_id>/delete", views.delete_forum_post, name="delete-forum-post"),
    path("<int:post_id>/upvote", views.upvote_post, name="upvote-post"),

    path("<int:post_id>/comments/", views.get_post_comments, name="post-comments"),
    path("comments/new/<int:post_id>", views.create_comment, name="create-comment"),
    path("comments/<int:comment_id>/update", views.update_comment, name="update-comment"),
    path("comments/<int:comment_id>/delete", views.delete_comment, name="delete-comment"),
    path("comments/<int:comment_id>/upvote", views.upvote_comment, name="upvote-comment"),
]