import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/auth/';  // Your backend URL
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // Register User (for SignUp)
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, userData);
  }

  // Login User
  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}token/`, credentials);
  }

  getToken(): string | null {
    if (this.localStorage) {
      return localStorage.getItem('access_token');
    }

    return null;
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}profile/`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

    updateUserProfile(updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}profile/update`, updatedData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }


  get localStorage(): typeof window['localStorage'] | undefined  {

    return isPlatformBrowser(this.platformId) ? window['localStorage'] : undefined;
  }

  storeUserData(response: any) {
    if (this.localStorage) {
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('username', response.username);
    }

  }

  // Logout user and blacklist refresh token
  logoutUser() {
    const refreshToken = localStorage.getItem('refresh_token');

    this.http.post(`${this.apiUrl}logout/`, { refresh: refreshToken }).subscribe({
      next: () => {

        window.location.reload();
      }, error: (err: Error) => {
        alert("Failed to logout");
        console.log(err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    });
  }
}
