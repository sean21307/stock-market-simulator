import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreatedOrderModel, OrderModel} from "../models/order.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService{
  private apiURL = 'http://127.0.0.1:8000/wallets/order/'

  constructor(private http : HttpClient, private authService :AuthService) {}

  getOrders(walletName: String): Observable<OrderModel[]>{
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.get<OrderModel[]>(this.apiURL + `/${walletName}`)
  }

  createOrder(createdOrder: CreatedOrderModel, walletName: string): Observable<OrderModel>{
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.post<OrderModel>(this.apiURL + `/${walletName}/create`, createdOrder)
  }

  deleteOrder(orderID: number){
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` };
    return this.http.delete(this.apiURL+`delete/${orderID}`)
  }

}
