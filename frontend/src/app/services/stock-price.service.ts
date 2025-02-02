import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockPriceService {

  public formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const monthShort = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${monthShort} ${day}`;
  }

  constructor() { }
}
