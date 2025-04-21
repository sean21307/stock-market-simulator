import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Stock } from '../../models/stock.model';
import { StockPriceService } from '../../services/stock-price.service';
import { CardComponent } from '../card/card.component';
import { ThemeService } from '../../services/theme.service';

import { AgCharts } from 'ag-charts-angular';
import {
  AgCartesianSeriesTooltipRendererParams,
  AgChartOptions,
  AgLineSeriesTooltipRendererParams,
} from 'ag-charts-types';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../models/wallet.model';
import { WalletDetails } from '../../models/walletDetails.model';
import { ChartService } from '../../services/chart.service';
import { WatchlistModalComponent } from '../watchlist-modal/watchlist-modal.component';
import { NewsStockModalComponent } from '../news-stock-modal/news-stock-modal.component';
import { OrderService } from '../../services/order.service';
import { AiStockModalComponent } from '../ai-stock-modal/ai-stock-modal.component';
import { NotificationService } from '../../services/notification.service';

function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null; // remove if integers should be required

    if (control.value && !Number.isInteger(Number(control.value))) {
      return { notInteger: true };
    }
    return null;
  };
}

function maxSharesValidator(
  getSharesDict: () => Record<string, number>,
  stockSymbol: string,
  isBuying: boolean
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isBuying) return null;

    const availableShares = getSharesDict()[stockSymbol] || 0;
    if (control.value > availableShares) {
      return { exceedsShares: { available: availableShares } };
    }
    return null;
  };
}

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [
    CardComponent,
    AgCharts,
    ReactiveFormsModule,
    CommonModule,
    WatchlistModalComponent,
    NewsStockModalComponent,
    AiStockModalComponent,
    FormsModule,
  ],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css',
})
export class StockDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  orderType = "Market";
  watchlistModalOpen = false;
  buyTab = true;
  darkMode = false;
  currentPrice: number = 0;
  chartOptions!: AgChartOptions;
  stock!: Stock;
  sharesDict!: Record<string, number>;
  buyForm = new FormGroup({
    quantity: new FormControl(1, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/),
      // integerValidator(),
      maxSharesValidator(
        () => this.sharesDict || [],
        this.stock?.stockInfo.symbol || '',
        this.buyTab
      ),
    ]),

    limitPrice: new FormControl(0, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/),
    ])
  });
  wallet!: WalletDetails;
  transactionComplete = false;
  transactionLoading = false;
  descriptionExpanded = false;

  constructor(
    private walletService: WalletService,
    private stockPriceService: StockPriceService,
    private themeService: ThemeService,
    private chartService: ChartService,
    private router: Router,
    private orderService: OrderService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  get quantityInvalid() {
    const control = this.buyForm.get('quantity');
    return control && control.invalid && (control.dirty || control.touched);
  }

  get quantityNonInt() {
    const control = this.buyForm.get('quantity');
    return control && control.invalid && control.hasError('pattern');
  }

  get quantity() {
    return this.buyForm.get('quantity')?.value;
  }

  get limitPriceInvalid() {
    const control = this.buyForm.get('limitPrice');
    return control && control.invalid && (control.dirty || control.touched);
  }

  get limitPriceNonInt() {
    const control = this.buyForm.get('limitPrice');
    return control && control.invalid && control.hasError('pattern');
  }

  get limitPrice() {
    return this.buyForm.get('limitPrice')?.value;
  }

  setBuying(state: boolean) {
    this.buyTab = state;

    this.buyForm.controls['quantity'].setValidators([
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/),
      maxSharesValidator(
        () => this.sharesDict,
        this.stock?.stockInfo.symbol || '',
        this.buyTab
      ),
    ]);
    this.buyForm.controls['quantity'].updateValueAndValidity();
  }

  reload() {
    window.location.reload();
  }

  onSubmit() {
    if (this.buyForm.invalid) {
      return;
    }

    this.transactionLoading = true;
    if (this.buyTab == true) {
      if (this.orderType === 'Limit') {

        this.orderService.createOrder({
          type: 'Buy',
          symbol: this.stock.stockInfo.symbol,
          quantity: +(this.buyForm.value.quantity ?? 0),
          target_price: +(this.buyForm.value.limitPrice ?? 0),
        }, this.wallet.wallet.name).subscribe({
          next: () => {
            this.transactionLoading = false;
            this.transactionComplete = true;
          },
          error: (err: Error) => {
            this.notificationService.addNotification({variant: 'danger', title:'Oops!', message:'Something went wrong when creating your order. Please try again.'});
            console.log(err);
            this.transactionLoading = false;
          },
        });

      } else {
        this.walletService
        .purchaseShares({
          symbol: this.stock.stockInfo.symbol,
          quantity: Number(this.buyForm.value.quantity) ?? 0,
          isEtf: this.stock.stockInfo.isEtf
        })
        .subscribe({
          next: () => {
            this.transactionLoading = false;
            this.transactionComplete = true;
          },
          error: (err: Error) => {
            this.notificationService.addNotification({variant: 'danger', title:'Oops!', message:'Something went wrong when purchasing shares. Please try again.'});
            console.log(err);
            this.transactionLoading = false;
          },
        });
      }
    } else {
      if (this.orderType === 'Limit') {
        this.orderService.createOrder({
          type: 'Sell',
          symbol: this.stock.stockInfo.symbol,
          quantity: +(this.buyForm.value.quantity ?? 0),
          target_price: +(this.buyForm.value.limitPrice ?? 0),
        }, this.wallet.wallet.name).subscribe({
          next: () => {
            this.transactionLoading = false;
            this.transactionComplete = true;
          },
          error: (err: Error) => {
            this.notificationService.addNotification({variant: 'danger', title:'Oops!', message:'Something went wrong when placing order. Please try again.'});
            console.log(err);
            this.transactionLoading = false;
          },
        });

      } else {
        this.walletService
          .sellShares({
            symbol: this.stock.stockInfo.symbol,
            quantity: Number(this.buyForm.value.quantity) ?? 0,
          })
          .subscribe({
            next: () => {
              this.transactionLoading = false;
              this.transactionComplete = true;
            },
            error: (err: Error) => {
              this.notificationService.addNotification({variant: 'danger', title:'Oops!', message:'Something went wrong when purchasing shares. Please try again.'});
              console.log(err);
              this.transactionLoading = false;
            },
          });
      }
    }
  }

  updateChartOptions() {
    if (!this.stock || !isPlatformBrowser(this.platformId)) return;
    console.log(this.stock.prices);


    this.chartOptions = this.chartService.getChartOptions(
      this.stock.prices
        .map((entry) => ({
          day: this.stockPriceService.formatDate(entry.date),
          price: entry.closing_price,
        }))
        .reverse(),
      this.darkMode
    );
  }

  formatMarketCap(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  loadStockData(symbol: string) {
    this.stockPriceService.getStockInfo(symbol).subscribe({
      next: (data: Stock) => {
        this.stock = data;
        this.stock.prices = [...this.stock.prices.slice(0, -1)];
        this.currentPrice = data.stockInfo.price;
        this.updateChartOptions();
      },
      error: (err: Error) => {
        console.log(err);
      },
    });
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.darkMode = isDark;
      this.updateChartOptions();
    });

    this.route.paramMap.subscribe((params) => {
      const symbol = params.get('symbol');
      if (symbol) {
        this.loadStockData(symbol);
      }
    });

    this.walletService.getSelectedWallet().subscribe({
      next: (wallet: WalletDetails) => {
        this.wallet = wallet;
        this.sharesDict = this.walletService.getSharesCountDictionary(
          this.wallet.shares
        );

        this.buyForm.controls['quantity'].setValidators([
          Validators.required,
          Validators.pattern(/^\d+(\.\d+)?$/),
          maxSharesValidator(
            () => this.sharesDict,
            this.stock?.stockInfo.symbol || '',
            this.buyTab
          ),
        ]);
        this.buyForm.controls['quantity'].updateValueAndValidity();
      },
    });
  }
}
