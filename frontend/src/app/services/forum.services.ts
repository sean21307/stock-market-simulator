import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ForumPost, ForumComment } from '../models/forum.model';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private apiUrl = 'http://127.0.0.1:8000/forum/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // or get from your AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  // ====================== Post Operations ======================
  getPosts(): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.apiUrl}posts/`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getPost(postId: number): Observable<ForumPost> {
    return this.http.get<ForumPost>(`${this.apiUrl}posts/${postId}/`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createPost(post: { title: string; content: string }): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.apiUrl}posts/create/`, post, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  upvotePost(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}posts/${postId}/upvote/`, {}, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ====================== Comment Operations ======================
  getComments(postId: number): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(`${this.apiUrl}posts/${postId}/comments/`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addComment(postId: number, content: string): Observable<ForumComment> {
    return this.http.post<ForumComment>(`${this.apiUrl}posts/${postId}/comments/create/`, { content }, {
      headers: this.getHeaders(),
    }).pipe(catchError(this.handleError));
  }

  upvoteComment(postId: number, commentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}posts/${postId}/comments/${commentId}/upvote/`, {}, {
      headers: this.getHeaders(),
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('ForumService error:', error);
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.detail) {
        errorMessage = error.error.detail;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
