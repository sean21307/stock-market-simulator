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

  // Logout User
  logoutUser(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');  // Assuming you're storing it in localStorage
    return this.http.post(`${this.apiUrl}logout/`, { refresh: refreshToken });
  }
}
