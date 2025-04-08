import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiURL = 'http://127.0.0.1:8000/wallets/order/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getOrders(walletName: String): Observable<Order[]> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.get<Order[]>(this.apiURL + `${walletName}`);
  }

  createOrder(createdOrder: Order, walletName: string): Observable<Order> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    console.log(createdOrder);
    return this.http.post<Order>(
      this.apiURL + `${walletName}/create`,
      createdOrder
    );
  }

  deleteOrder(orderID: number) {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.delete(this.apiURL + `delete/${orderID}`);
  }
}
