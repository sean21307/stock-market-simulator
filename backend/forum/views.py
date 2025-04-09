import decimal
from decimal import Decimal
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ForumPost, ForumComment
from .serializers import ForumPostSerializer, ForumCommentSerializer

@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_forum_posts(request):
    posts = ForumPost.objects.all().order_by('-created_at')
    post_list = []
    for post in posts:
        post_data = ForumPostSerializer(post).data
        post_list.append(post_data)
    return Response(post_list, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_forum_post(request):
    try:
        post = ForumPost.objects.create(
            title=request.data.get('title'),
            content=request.data.get('content'),
            user=request.user,
            image=request.data.get('image', None)
        )
        return Response(ForumPostSerializer(post).data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PUT'])
def update_forum_post(request, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, user=request.user)
        post.title = request.data.get('title', post.title)
        post.content = request.data.get('content', post.content)
        if 'image' in request.data:
            post.image = request.data.get('image')
        post.save()
        return Response(ForumPostSerializer(post).data, status=status.HTTP_200_OK)
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
@api_view(['POST'])
def create_comment(request, post_id):
    try:
        post = ForumPost.objects.get(id=post_id)
        comment = ForumComment.objects.create(
            content=request.data.get('content'),
            user=request.user,
            post=post
        )
        return Response(ForumCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PUT'])
def update_comment(request, comment_id):
    try:
        comment = ForumComment.objects.get(id=comment_id, user=request.user)
        comment.content = request.data.get('content', comment.content)
        comment.save()
        return Response(ForumCommentSerializer(comment).data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_comment(request, comment_id):
    try:
        comment = ForumComment.objects.get(id=comment_id, user=request.user)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
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

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upvote_comment(request, comment_id):
    try:
        comment = ForumComment.objects.get(id=comment_id)
        comment.upvotes += 1
        comment.save()
        return Response({'upvotes': comment.upvotes}, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_post_comments(request, post_id):
    try:
        post = ForumPost.objects.get(id=post_id)
        comments = post.comments.all().order_by('created_at')
        comment_list = []
        for comment in comments:
            comment_list.append(ForumCommentSerializer(comment).data)
        return Response(comment_list, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)