import { Component, NgModule, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../services/wallet.service';
import { WalletDetails } from '../../models/walletDetails.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent implements OnInit {
  transactions!: Transaction[];

  constructor(private walletService: WalletService) {}

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
    alert("Transactions successfully exported to CSV!");
  }



  ngOnInit() {
    this.walletService.getSelectedWalletName().subscribe(
      (response: string) => {
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
        alert('Registration failed. Check console for errors.');
        console.error('Registration failed', error);
      }
    );
  }
}
