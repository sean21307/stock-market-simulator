import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../services/forum.services';
import { ForumPost, ForumComment } from '../../models/forum.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  providers: [DatePipe]
})
export class ForumComponent implements OnInit {
  forumPosts: ForumPost[] = [];
  newCommentContent = '';
  newPost = { title: '', content: '' };
  showPostForm = false;
  isLoading = true;
  error = '';
  currentPostPage = 1;
  POST_PAGE_SIZE = 10;
  currentUser: { username: string } | null = null;
  selectedPost: ForumPost | null = null;

  constructor(
    private datePipe: DatePipe,
    private forumService: ForumService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/auth']);
      return;
    }

    this.authService.getUserProfile().subscribe({
      next: (userData) => {
        this.currentUser = userData;
        this.loadPosts();
      },
      error: (err) => {
        console.error('Failed to fetch user profile', err);
        this.loadPosts();
      }
    });
  }

  get totalPostPages(): number {
    return Math.ceil(this.forumPosts.length / this.POST_PAGE_SIZE);
  }

  get postPages(): number[] {
    return Array.from({ length: this.totalPostPages }, (_, i) => i + 1);
  }

  incrementPostPage() {
    this.currentPostPage = Math.min(this.currentPostPage + 1, this.totalPostPages);
  }

  decrementPostPage() {
    this.currentPostPage = Math.max(this.currentPostPage - 1, 1);
  }

  setPostPage(page: number) {
    this.currentPostPage = page;
  }

  get paginatedPosts(): ForumPost[] {
    const start = (this.currentPostPage - 1) * this.POST_PAGE_SIZE;
    const end = start + this.POST_PAGE_SIZE;
    return this.forumPosts.slice(start, end);
  }

  loadPosts(): void {
    this.isLoading = true;
    this.forumService.getPosts().subscribe({
      next: (posts) => {
        console.log(posts);
        this.forumPosts = posts;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load posts';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  openPostModal(post: ForumPost): void {
    this.selectedPost = post;
    if (!this.selectedPost.comments) {
      this.forumService.getComments(post.id).subscribe({
        next: (comments) => {
          if (this.selectedPost) {
            this.selectedPost.comments = comments;
          }
        },
        error: (err) => console.error('Failed to load comments', err)
      });
    }
  }

  deletePost(postId: number): void {
    if (!confirm('Are you sure you want to delete this post?')) return;
  
    this.forumService.deletePost(postId).subscribe({
      next: () => {
        this.forumPosts = this.forumPosts.filter(post => post.id !== postId);
        if (this.selectedPost && this.selectedPost.id === postId) {
          this.closePostModal();
        }
      },
      error: (err) => console.error('Failed to delete post', err)
    });
  }

  closePostModal(): void {
    this.selectedPost = null;
    this.newCommentContent = '';
  }

  addComment(post: ForumPost): void {
    if (!this.newCommentContent.trim()) return;

    this.forumService.addComment(post.id, this.newCommentContent).subscribe({
      next: (comment) => {
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
        this.newCommentContent = '';

        const index = this.forumPosts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.forumPosts[index] = { ...post };
        }
      },
      error: (err) => console.error('Failed to add comment', err)
    });
  }

  upvotePost(post: ForumPost): void {
    this.forumService.upvotePost(post.id).subscribe({
      next: () => {
        post.upvotes++;
        const index = this.forumPosts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.forumPosts[index].upvotes = post.upvotes;
        }
      },
      error: (err) => console.error('Failed to upvote post', err)
    });
  }

  upvoteComment(comment: ForumComment): void {
    this.forumService.upvoteComment(comment.postId, comment.id).subscribe({
      next: () => comment.upvotes++,
      error: (err) => console.error('Failed to upvote comment', err)
    });
  }

  submitPost(): void {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      console.warn('Title or content is empty');
      return;
    }
  
    this.forumService.createPost(this.newPost).subscribe({
      next: (post) => {
        console.log('Post created successfully:', post); // Verify the response
        this.forumPosts.unshift(post);
        this.newPost = { title: '', content: '' };
        this.showPostForm = false;
      },
      error: (err) => console.error('Failed to create post', err)
    });
  }

  formatDate(dateString: string): string | null {
    return this.datePipe.transform(dateString, 'medium');
  }


  

  onCreatePost(): void {
    this.showPostForm = true;
  }

  cancelPost(): void {
    this.showPostForm = false;
    this.newPost = { title: '', content: '' };
  }

  
}
