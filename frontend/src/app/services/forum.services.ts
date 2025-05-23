import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ForumPost, ForumComment } from '../models/forum.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://127.0.0.1:8000/forum/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ====================== Post Operations ======================

  getPosts(): Observable<ForumPost[]> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<ForumPost[]>(`${this.apiUrl}posts/`, { headers });
  }

  getPost(postId: number): Observable<ForumPost> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<ForumPost>(`${this.apiUrl}posts/${postId}/`, { headers });
  }

  createPost(post: { title: string; content: string }): Observable<ForumPost> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post<ForumPost>(`${this.apiUrl}posts/create/`, post, { headers });
  }

  deletePost(postId: number): Observable<void> {
    const headers = {
      Authorization: `Bearer ${this.authService.getToken()}`
    };
    return this.http.delete<void>(`${this.apiUrl}posts/${postId}/delete/`, { headers });
  }

  upvotePost(postId: number): Observable<void> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.patch<void>(`${this.apiUrl}posts/${postId}/upvote/`, {}, { headers });
  }

    updatePost(postId: number, post: { title: string; content: string }): Observable<ForumPost> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.put<ForumPost>(`${this.apiUrl}posts/${postId}/update/`, post, { headers });
  }

  // ====================== Comment Operations ======================

  getComments(postId: number): Observable<ForumComment[]> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<ForumComment[]>(`${this.apiUrl}posts/${postId}/comments/`, { headers });
  }

  addComment(postId: number, content: string): Observable<ForumComment> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post<ForumComment>(`${this.apiUrl}posts/${postId}/comments/create/`, { content }, { headers });
  }

  upvoteComment(postId: number, commentId: number): Observable<ForumComment> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.patch<ForumComment>(`${this.apiUrl}posts/${postId}/comments/${commentId}/upvote/`, {}, { headers });
  }

  updateComment(postId: number, commentId: number, content: string): Observable<ForumComment> {
  const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.put<ForumComment>(
      `${this.apiUrl}posts/${postId}/comments/${commentId}/update/`, { content }, { headers });
  }

  deleteComment(postId: number, commentId: number): Observable<any> {
  const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
  return this.http.delete(`${this.apiUrl}posts/${postId}/comments/${commentId}/delete/`, { headers });
}
}
