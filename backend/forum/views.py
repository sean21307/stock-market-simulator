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

# ====================== Board Operations ======================
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_boards(request):
    # Get all unique board names from posts
    boards = ForumPost.objects.values_list('board_name', flat=True).distinct()
    return Response(list(boards), status=status.HTTP_200_OK)

# ====================== Post Operations ======================
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_forum_posts(request, board_name):
    posts = ForumPost.objects.filter(board_name=board_name).order_by('-created_at')
    serializer = ForumPostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_single_post(request, board_name, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, board_name=board_name)
        serializer = ForumPostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_forum_post(request, board_name):
    try:
        post = ForumPost.objects.create(
            board_name=board_name,
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
def update_forum_post(request, board_name, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, board_name=board_name, user=request.user)
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
def delete_forum_post(request, board_name, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, board_name=board_name, user=request.user)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upvote_post(request, board_name, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, board_name=board_name)
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
def get_post_comments(request, board_name, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, board_name=board_name)
        comments = post.comments.all().order_by('created_at')
        serializer = ForumCommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_single_comment(request, board_name, post_id, comment_id):
    try:
        comment = ForumComment.objects.get(id=comment_id, post_id=post_id, post__board_name=board_name)
        serializer = ForumCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_comment(request, board_name, post_id):
    try:
        post = ForumPost.objects.get(id=post_id, board_name=board_name)
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
def update_comment(request, board_name, post_id, comment_id):
    try:
        comment = ForumComment.objects.get(
            id=comment_id,
            post_id=post_id,
            post__board_name=board_name,
            user=request.user
        )
        comment.content = request.data.get('content', comment.content)
        comment.save()
        return Response(ForumCommentSerializer(comment).data, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_comment(request, board_name, post_id, comment_id):
    try:
        comment = ForumComment.objects.get(
            id=comment_id,
            post_id=post_id,
            post__board_name=board_name,
            user=request.user
        )
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upvote_comment(request, board_name, post_id, comment_id):
    try:
        comment = ForumComment.objects.get(
            id=comment_id,
            post_id=post_id,
            post__board_name=board_name
        )
        comment.upvotes += 1
        comment.save()
        return Response({'upvotes': comment.upvotes}, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)