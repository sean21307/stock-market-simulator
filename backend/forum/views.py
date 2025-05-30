from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ForumPost, ForumComment
from .serializers import ForumPostSerializer, ForumCommentSerializer

# ====================== Post Operations ======================
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_forum_posts(request):
    posts = ForumPost.objects.all().order_by('-created_at')
    serializer = ForumPostSerializer(posts, many=True)
    forum_posts = serializer.data
    for post in forum_posts:
        user_id = post['user']
        username = User.objects.get(id=user_id).username
        post['user'] = username
    return Response(forum_posts, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_forum_post(request):
    try:
        if not request.data.get('title'):
            return Response({'error': 'Title is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not request.data.get('content'):
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

        post = ForumPost.objects.create(
            title=request.data.get('title'),
            content=request.data.get('content'),
            user=request.user,
        )
        
        post_data = ForumPostSerializer(post).data
        post_data['user'] = request.user.username

        return Response(post_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e), 'details': 'Check your request data format'},
                        status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PUT'])
def update_forum_post(request, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, user=request.user)
        post.title = request.data.get('title', post.title)
        post.content = request.data.get('content', post.content)
        post.save()

        put_data = ForumPostSerializer(post).data
        put_data['user'] = request.user.username
        return Response(put_data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_forum_post(request, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, user=request.user)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def upvote_post(request, post_id):
    try:
        post = ForumPost.objects.get(id=post_id)
        post.upvotes += 1
        post.save()
        return Response({'upvotes': post.upvotes}, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ====================== Comment Operations ======================
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_post_comments(request, post_id):
    try:
        post = ForumPost.objects.get(id=post_id)
        comments = post.comments.all().order_by('created_at')
        serializer = ForumCommentSerializer(comments, many=True)
        forum_comments = serializer.data
        for comment in forum_comments:
            user_id = comment['user']
            username = User.objects.get(id=user_id).username
            comment['user'] = username
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_comment(request, post_id):
    try:
        if not request.data.get('content'):
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

        post = ForumPost.objects.get(id=post_id)
        comment = ForumComment.objects.create(
            content=request.data.get('content'),
            user=request.user,
            post=post
        )
        username = request.user.username
        response_obj = ForumCommentSerializer(comment).data
        response_obj['user'] = username
        return Response(response_obj, status=status.HTTP_201_CREATED)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PUT'])
def update_comment(request, post_id, comment_id):
    try:
        comment = ForumComment.objects.get(
            id=comment_id,
            post_id=post_id,
            user=request.user
        )
        comment.content = request.data.get('content', comment.content)
        comment.save()

        put_data = ForumCommentSerializer(comment).data
        put_data['user'] = request.user.username
        return Response(put_data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_comment(request, post_id, comment_id):
    try:
        comment = ForumComment.objects.get(
            id=comment_id,
            post_id=post_id,
            user=request.user
        )
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def upvote_comment(request, post_id, comment_id):
    try:
        comment = ForumComment.objects.get(
            id=comment_id,
            post_id=post_id
        )
        comment.upvotes += 1
        comment.save()

        # Return the full updated comment data
        serializer = ForumCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)