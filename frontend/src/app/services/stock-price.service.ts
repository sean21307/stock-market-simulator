import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartialStock, Stock } from '../models/stock.model';
import { AllStock } from '../models/allStocks.model';
import { SearchResult } from '../models/searchResult.model';
import { CongressTrade } from '../models/congressTrade.model';



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

  // Fetch recent trades from congress
  public getCongressTrades(): Observable<CongressTrade[]> {
    return this.http.get<CongressTrade[]>(`${this.baseUrl}congress/`);
  }

  // Fetch stocks based on search query
  public getSearchResults(query: string): Observable<SearchResult[]> {
    query = query.trim();
    return this.http.get<SearchResult[]>(`${this.baseUrl}search/${query}`);
  }

  // Fetch detailed stock info for a specific symbol
  public getStockInfo(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}${symbol}/`);
  }

  // Fetch data for all stocks using the AllStocksModel
  public getAllStocks(): Observable<AllStock[]> {
    return this.http.get<AllStock[]>(`${this.baseUrl}`);
  }

  public getStockInfoFromSymbolList(symbolList: string[]): Observable<Record<string, PartialStock>> {
    console.log(symbolList);
    return this.http.post<Record<string, PartialStock>>(`${this.baseUrl}quotes/`, {symbols: symbolList});
  }

  public formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const monthShort = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${monthShort} ${day}`;
  }

}
