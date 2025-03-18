import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://127.0.0.1:8000/news/';  

  constructor(private http: HttpClient) {}

  getGeneralNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getStockNews(symbol: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${symbol}/`);
  }
}
