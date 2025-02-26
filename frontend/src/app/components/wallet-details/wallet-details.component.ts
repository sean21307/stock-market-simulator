import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WalletDetails } from '../../models/walletDetails.model';
import { WalletService } from '../../services/wallet.service';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';
import { PartialStock, Stock } from '../../models/stock.model';
import { StockPriceService } from '../../services/stock-price.service';

@Component({
  selector: 'app-wallet-details',
  standalone: true,
  imports: [CardComponent, CommonModule, RouterModule],
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.css'
})
export class WalletDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  walletDetails!: WalletDetails;
  sharesDict!: Record<string, number>;
  stockDict: Record<string, PartialStock> = {};
  portfolioValue = 0;

  constructor(private walletService: WalletService, private stockService: StockPriceService) {}

  get keys() {
    return Object.keys
  }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.walletService.getWalletDetails(name).subscribe({
        next: (wallet: WalletDetails) => {
          this.walletDetails = wallet;
          this.sharesDict = this.walletService.getSharesCountDictionary(this.walletDetails.shares)
          
          let symbolList = Object.keys(this.sharesDict);
          this.stockService.getStockInfoFromSymbolList(symbolList).subscribe({
            next: (info: Record<string, PartialStock>) => {
              this.stockDict = info;

              for (let symbol of Object.keys(this.stockDict)) {
                this.portfolioValue += this.stockDict[symbol].price * this.sharesDict[symbol]
              }
            }
          })
        }
      })
    }
  }
}
