import { Component, NgModule, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../services/wallet.service';
import { WalletDetails } from '../../models/walletDetails.model';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { StockPriceService } from '../../services/stock-price.service';
import { CongressTrade } from '../../models/congressTrade.model';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent implements OnInit {
  transactions!: Transaction[];
  orders!: Order[];
  congressTrades!: CongressTrade[];
  deleteLimitOrderModalOpen = false;
  deleteLimitOrderId = -1;
  walletName!: string;

  constructor(
    private walletService: WalletService, 
    private notificationService: NotificationService,
    private stockService: StockPriceService,
    private orderService: OrderService,
  ) {}

  deleteLimitOrder() {
    this.deleteLimitOrderModalOpen = false;
    this.orderService.deleteOrder(this.deleteLimitOrderId).subscribe(result => {
      this.notificationService.addNotification({variant: 'success', title:'Success!', message:'Successfully canceled order.'});
      this.fetchOrderHistory();
    })
  }

  getDate(timestamp: string) {
    return new Date(timestamp).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  }

  getTime(timestamp: string) {
    return new Date(timestamp).toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true,
    }).replace(/^0/, '');
  }

  fetchOrderHistory() {
    this.orderService.getOrders(this.walletName).subscribe((response: Order[]) => {
      this.orders = response;
    }, (err) => {
      console.error(err);
    })
    
  }

  exportToCSV() {
    if (!this.transactions || this.transactions.length === 0) {
        alert("No transactions to export.");
        return;
    }

    let csvContent = "Type,Date,Time,Asset,Price Purchased,Profit/Loss\n";

    this.transactions.forEach(transaction => {
        let row = `${transaction.type},${this.getDate(transaction.date)} ${this.getTime(transaction.date)},${transaction.symbol},$${transaction.total_price},$${transaction.profit || '0'}`;
        csvContent += row + "\n";
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    this.notificationService.addNotification({variant: 'success', title:'Success!', message:'Exported and downloaded transaction data.'});
    // alert("Transactions successfully exported to CSV!");
  }

  exportOrderHistoryToCSV() {
    if (!this.orders || this.orders.length === 0) {
        alert("No orders to export.");
        return;
    }

    let csvContent = "Type,Date,Time,Asset,Amount,Status\n";

    this.orders.forEach(order => {
        let row = `${order.type},${this.getDate(order.date || '')} ${this.getTime(order.date || '')},${order.symbol},$${order.target_price},${order.status}`;
        csvContent += row + "\n";
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    this.notificationService.addNotification({variant: 'success', title:'Success!', message:'Exported and downloaded limit orders data.'});
    // alert("Transactions successfully exported to CSV!");
  }



  ngOnInit() {
    this.stockService.getCongressTrades().subscribe(result => {
      this.congressTrades = result;
    })

    this.walletService.getSelectedWalletName().subscribe(
      (response: string) => {
        this.walletName = response;

        this.fetchOrderHistory();

        this.walletService.getTransactionHistory(response).subscribe(
          (response: {purchases: Transaction[], sales: Transaction[]}) => {
            this.transactions = [];

            response.purchases.forEach((tr: Transaction) => {
              this.transactions.push({ ...tr, type: 'Buy' });
            });
        
            response.sales.forEach((tr: Transaction) => {
              this.transactions.push({ ...tr, type: 'Sell', quantity_purchased: tr.quantity_sold });
            });

            this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          }
        )
      },
      (error) => {
        alert("You don't have a wallet selected.");
        console.error(error);
      }
    );
  }
}
