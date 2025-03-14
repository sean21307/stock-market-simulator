import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://127.0.0.1:8000/news/';

  constructor(private http: HttpClient) {}

  getGeneralNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getStockNews(symbol: string, fromDate = '2024-01-01', toDate = '2024-03-01', page = 0, limit = 50): Observable<any[]> {
    const params = { from: fromDate, to: toDate, page: page.toString(), limit: limit.toString() };
    return this.http.get<any[]>(`${this.apiUrl}stock/${symbol}/`, { params });
  }

  getLatestStockNews(): Observable<any[]> {
    return this.getGeneralNews().pipe(
      switchMap((news: any[]) => {
        if (!news.length) {
          return throwError(() => new Error('No news available.'));
        }
        return [news.slice(0, 5)]; // Return the latest 5 articles
      })
    );
  }
}
