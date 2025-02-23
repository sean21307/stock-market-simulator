import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/auth/';  // Your backend URL

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
    return localStorage.getItem('access_token');
  }

  storeUserData(response: any) {
    
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('username', response.username);  
  }

  // Logout user and blacklist refresh token
  logoutUser() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    this.http.post(`${this.apiUrl}logout/`, { refresh: refreshToken }).subscribe({
      next: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
      }, error: (err: Error) => {
        alert("Failed to logout");
        console.log(err);
      }
    });
  }
}
