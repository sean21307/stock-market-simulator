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
    this.initializeMockData();
    return;

    this.forumService.getPosts().subscribe({
      next: (posts) => {
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
    this.selectedPost = { ...post };
    // Load comments if not already loaded
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

        // Update the post in the main list
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
        // Update the post in the main list
        const index = this.forumPosts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.forumPosts[index].upvotes = post.upvotes;
        }
      },
      error: (err) => console.error('Failed to upvote post', err)
    });
  }

  upvoteComment(comment: ForumComment): void {
    this.forumService.upvoteComment(comment.id).subscribe({
      next: () => comment.upvotes++,
      error: (err) => console.error('Failed to upvote comment', err)
    });
  }

  submitPost(): void {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) return;

    this.forumService.createPost(this.newPost).subscribe({
      next: (post) => {
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

  private initializeMockData(): void {
    this.forumPosts = [
      {
        id: 1,
        user: 'tech_enthusiast',
        title: 'Getting started with Robinhood',
        content: 'I\'m a noob can someone sell me their course',
        created_at: new Date('2023-11-15T10:30:00').toISOString(),
        upvotes: 24,
        comments: [
          {
            id: 101,
            user: 'robinhood_fan',
            content: 'Duuuude I gotchu join my Discord',
            created_at: new Date('2023-11-15T11:45:00').toISOString(),
            upvotes: 8
          },
          {
            id: 102,
            user: 'web_dev_42',
            content: 'Robinhood sucks just use Stock-Market-Simulator instead ur literally already here',
            created_at: new Date('2023-11-15T14:20:00').toISOString(),
            upvotes: 3
          }
        ]
      },
      {
        id: 2,
        user: 'retriment_guy',
        title: 'Why is everything crashing????',
        content: 'Dude... MY WHOLE IRA IS GONE',
        created_at: new Date('2023-11-10T09:15:00').toISOString(),
        upvotes: 42,
        comments: [
          {
            id: 201,
            user: 'econ-nerd',
            content: 'Yeah you are cooked buddy im so sorry',
            created_at: new Date('2023-11-10T10:30:00').toISOString(),
            upvotes: 15
          },
          {
            id: 202,
            user: 'japanese-dude723',
            content: 'Just be glad your not Japanese we are even more cooked',
            created_at: new Date('2023-11-10T12:45:00').toISOString(),
            upvotes: 5
          },
          {
            id: 203,
            user: 'bee_queen',
            content: 'I think it will get better just HOLD',
            created_at: new Date('2023-11-11T08:20:00').toISOString(),
            upvotes: 12
          }
        ]
      }
    ];
    this.isLoading = false;
  }
}
