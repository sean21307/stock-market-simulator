import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Wallet } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://127.0.0.1:8000/wallets/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getWallets(): Observable<Wallet[]> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<Wallet[]>(`${this.apiUrl}`, { headers });
  }

  createWallet(body: {name: string, description: string}): Observable<Wallet> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post<Wallet>(`${this.apiUrl}new`, body, { headers });
  }

  setSelectedWallet(walletName: string): Observable<{ wallet_id: number }> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post<{ wallet_id: number }>(`${this.apiUrl}${walletName}/select`, {}, { headers });
  }

  getSelectedWalletName(): Observable<string> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<{ selected_wallet_name: string }>(`${this.apiUrl}selected_wallet`, { headers })
    .pipe(
      map(response => response.selected_wallet_name)
    );
  }
}
