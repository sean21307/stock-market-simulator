import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WalletDetails } from '../../models/walletDetails.model';
import { WalletService } from '../../services/wallet.service';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';
import { PartialStock, Stock } from '../../models/stock.model';
import { StockPriceService } from '../../services/stock-price.service';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-types';
import { ChartService } from '../../services/chart.service';
import { ThemeService } from '../../services/theme.service';
import { WatchlistModalComponent } from '../watchlist-modal/watchlist-modal.component';
import { WatchlistService } from '../../services/watchlist.service';
import { Watchlist } from '../../models/watchlist.model';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-wallet-details',
  standalone: true,
  imports: [CardComponent, CommonModule, RouterModule, AgCharts, WatchlistModalComponent, ModalComponent],
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.css'
})
export class WalletDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  walletDetails!: WalletDetails;
  sharesDict!: Record<string, number>;
  stockDict: Record<string, PartialStock> = {};
  portfolioValue = 0;
  prices!: { date: Date, closing_price: number }[];
  chartOptions!: AgChartOptions;
  darkMode = false;

  deleteWatchlistModalOpen = false;
  deleteWatchlistName: string | undefined = undefined;

  watchlistModalOpen = false;
  watchlistStockDict: Record<string, PartialStock> = {};
  watchlists: Record<string, string[]> = {};
  expandedLists: Record<string, boolean> = {};

  constructor(
    private walletService: WalletService,
    private watchlistService: WatchlistService,
    private stockService: StockPriceService,
    private chartService: ChartService,
    private stockPriceService: StockPriceService,
    private themeService: ThemeService,
  ) {}

  get keys() {
    return Object.keys
  }

  generateMockStockData(finalValue: number, numDays: number = 30) {
    const data = [];
    let currentDate = new Date();
    let currentValue = finalValue;

    for (let i = 0; i < numDays; i++) {
        let change = (Math.random() - 0.45) * (currentValue * 0.04);
        change += currentValue * 0.0005;
        currentValue -= change;

        const formattedDate = currentDate.toISOString().split('T')[0];

        data.push({
            date: formattedDate,
            closing_price: parseFloat(currentValue.toFixed(2))
        });

        currentDate.setDate(currentDate.getDate() - 1);
    }

    return data;
  }

  promptDeleteWatchlist(name: string) {
    this.deleteWatchlistName = name;
    this.deleteWatchlistModalOpen = true;
  }

  deleteWatchlist() {
    if (!this.deleteWatchlistName) return;

    this.watchlistService.deleteWatchlist(this.deleteWatchlistName).subscribe({
      next: () => {
        if (!this.deleteWatchlistName) return;
        delete this.watchlists[this.deleteWatchlistName];
        this.deleteWatchlistModalOpen = false;
      },
      error: (err: Error) => {
        alert("Failed to delete watchlist. Check console for errors");
        console.error('Error deleting watchlist:', err);
        this.deleteWatchlistModalOpen = false;
      },
    });
  }

  updateChartOptions() {
    //if (!isPlatformBrowser(this.platformId)) return;
    if (!this.prices) return;

    this.chartOptions = this.chartService.getChartOptions(
      this.prices.map(entry => ({
        day: new Date(entry.date.toISOString()).toLocaleString(),
        price: entry.closing_price
      })),
      this.darkMode,
    )
  }

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
      this.updateChartOptions();
    });

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

              this.prices = this.walletDetails.wallet_values_overtime.map(entry => ({
                date: new Date(entry.date),
                closing_price: entry.value
              })).filter((entry, index, array) => 
                index === 0 || entry.closing_price !== array[index - 1].closing_price
              );

              this.updateChartOptions()
            }
          })
        }
      })
    }

    // get watchlists first then get stock details
    this.watchlistService.getWatchlists().subscribe({
      next: (data: Record<string, string[]>) => {
        this.watchlists = data;

        let symbolList = Array.from(
          new Set(Object.values(this.watchlists).flat())
        );

        this.stockService.getStockInfoFromSymbolList(symbolList).subscribe({
          next: (info: Record<string, PartialStock>) => {
            this.watchlistStockDict = info;
          }
        })
      }
    })
    
    
    
  }
}
