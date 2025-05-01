import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Wallet } from '../models/wallet.model';
import { Share, WalletDetails } from '../models/walletDetails.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://127.0.0.1:8000/wallets/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTransactionHistory(walletName: string): Observable<{purchases: Transaction[], sales: Transaction[]}> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<{purchases: Transaction[], sales: Transaction[]}>(`${this.apiUrl}${walletName}/transaction-history`, { headers });
  }

  getWallets(): Observable<Wallet[]> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<Wallet[]>(`${this.apiUrl}`, { headers });
  }

  getWalletDetails(walletName: string): Observable<WalletDetails> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<WalletDetails>(`${this.apiUrl}${walletName}`, { headers });
  }

  createWallet(body: {name: string, description: string}): Observable<Wallet> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post<Wallet>(`${this.apiUrl}new`, body, { headers });
  }

  deleteWallet(name: string): Observable<void> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.delete<void>(`${this.apiUrl}${name}/delete`, { headers });
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

  getSelectedWallet(): Observable<WalletDetails> {
    return this.getSelectedWalletName().pipe(
      switchMap((walletName: string) => {
        if (!walletName) {
          return throwError(() => new Error('No wallet selected.'));
        }
        console.log(walletName);
        return this.getWalletDetails(walletName);
      })
    );
  }

  getSharesCountDictionary(shares: Share[]): Record<string, number> {
    let acc = {} as Record<string, number>
    shares.forEach((share: Share) => {
      acc[share.symbol] = share.quantity;
    })

    return acc

    // return shares.reduce((acc, share) => {
    //     acc[share.symbol] = (acc[share.symbol] || 0) + 1;
    //     return acc;
    // }, {} as Record<string, number>);
  }


  purchaseShares(body: { symbol: string, quantity: number, isEtf: boolean }): Observable<any> {
    return this.getSelectedWalletName().pipe(
      switchMap((walletName: string | null) => {
        if (!walletName) {
          return throwError(() => new Error('No wallet selected.'));
        }

        const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
        return this.http.post<any>(`${this.apiUrl}${walletName}/add-shares`, body, { headers });
      })
    );
  }

  sellShares(body: { symbol: string, quantity: number }): Observable<any> {
    return this.getSelectedWalletName().pipe(
      switchMap((walletName: string | null) => {
        if (!walletName) {
          return throwError(() => new Error('No wallet selected.'));
        }

        const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
        return this.http.post<any>(`${this.apiUrl}${walletName}/sell-shares`, body, { headers });
      })
    );
  }

}
