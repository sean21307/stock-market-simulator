import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';


type stockData = {
  date: string,
  closing_price: string
}

@Injectable({
  providedIn: 'root'
})
export class StockPriceService {
  constructor(private http: HttpClient) { }

  public getStockPrices(symbol: string): Observable<stockData[]> {
    return this.http.get<stockData[]>(`http://127.0.0.1:8000/stocks/${symbol}`);
  }

  public getStockInfo(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(`http://127.0.0.1:8000/stocks/new/${symbol}`);
  }
  

  public formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const monthShort = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${monthShort} ${day}`;
  }

}
