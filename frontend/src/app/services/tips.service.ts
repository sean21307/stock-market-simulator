import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipsService {
  private apiUrl = 'http://127.0.0.1:8000/tips';  

  constructor(private http: HttpClient) {}

  getInvestingTips(): Observable<{ tips: string[] }> {
    return this.http.get<{ tips: string[] }>(`${this.apiUrl}/investing-tips`);
  }
}
