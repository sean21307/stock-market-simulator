import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForumPost, ForumComment } from '../models/forum.model';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private apiUrl = 'http://localhost:8000/api/forum';

  constructor(private http: HttpClient) {}

  // Posts
  getPosts(): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.apiUrl}/posts/`);
  }

  createPost(post: { title: string; content: string }): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.apiUrl}/posts/create/`, post);
  }

  upvotePost(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/posts/${postId}/upvote/`, {});
  }

  // Comments
  getComments(postId: number): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(`${this.apiUrl}/posts/${postId}/comments/`);
  }

  addComment(postId: number, content: string): Observable<ForumComment> {
    return this.http.post<ForumComment>(
      `${this.apiUrl}/comments/create/${postId}/`,
      { content }
    );
  }

  upvoteComment(commentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/comments/${commentId}/upvote/`, {});
  }
}
