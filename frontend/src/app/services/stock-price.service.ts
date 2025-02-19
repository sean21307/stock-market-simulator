import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';
import { AllStock } from '../models/allStocks.model';



type stockData = {
  date: string,
  closing_price: string
}

@Injectable({
  providedIn: 'root'
})
export class StockPriceService {
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://127.0.0.1:8000/stocks/';


  // Fetch detailed stock info for a specific symbol
  public getStockInfo(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}${symbol}/`);
  }

  // Fetch data for all stocks using the AllStocksModel
  public getAllStocks(): Observable<AllStock[]> {
    return this.http.get<AllStock[]>(`${this.baseUrl}`);
  }


  public formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const monthShort = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${monthShort} ${day}`;
  }

}
