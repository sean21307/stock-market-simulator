import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Watchlist } from '../models/watchlist.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://127.0.0.1:8000/watchlists/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  createWatchlist(body: {name: string}): Observable<Watchlist> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post<Watchlist>(`${this.apiUrl}new/`, body, { headers });
  }

  deleteWatchlist(name: string): Observable<void> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.delete<void>(`${this.apiUrl}delete/${name}/`, { headers });
  }

  getWatchlists(): Observable<Record<string, string[]>> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<Record<string, string[]>>(`${this.apiUrl}`, { headers })
  }

  addStockToWatchlist(name: string, symbol: string) {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post(`${this.apiUrl}${name}/add-stock/${symbol}`, {}, { headers });
  }
  
  removeStockFromWatchlist(name: string, symbol: string) {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.delete(`${this.apiUrl}${name}/remove-stock/${symbol}`, { headers });
  }
  
}
