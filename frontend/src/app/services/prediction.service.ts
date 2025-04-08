import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://127.0.0.1:8000/stock-prediction/';  

  constructor(private http: HttpClient) {}

  getPricePrediction(symbol: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${symbol}/`);
  }
}
