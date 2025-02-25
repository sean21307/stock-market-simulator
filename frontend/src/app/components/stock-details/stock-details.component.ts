import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Stock } from '../../models/stock.model';
import { StockPriceService } from '../../services/stock-price.service';
import { CardComponent } from "../card/card.component";
import { ThemeService } from '../../services/theme.service';

import { AgCharts } from 'ag-charts-angular';
import { AgCartesianSeriesTooltipRendererParams, AgChartOptions, AgLineSeriesTooltipRendererParams } from 'ag-charts-types';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../models/wallet.model';
import { WalletDetails } from '../../models/walletDetails.model';


function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !Number.isInteger(Number(control.value))) {
      return { 'notInteger': true };
    }
    return null;
  }
}

function maxSharesValidator(getSharesDict: () => Record<string, number>, stockSymbol: string, isBuying: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isBuying) return null;

    const availableShares = getSharesDict()[stockSymbol] || 0;
    if (control.value > availableShares) {
      return { 'exceedsShares': { available: availableShares } };
    }
    return null;
  };
}

function renderer({
  datum,
  xKey,
  yKey,
  yName,
}: AgLineSeriesTooltipRendererParams) {
  return {
    data: [
      {
        label: datum[xKey],
        value: '$' + datum[yKey].toFixed(2),
      },
    ],
  };
}

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CardComponent, AgCharts, ReactiveFormsModule, CommonModule],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css',
})
export class StockDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  buyTab = true;
  darkMode = false;
  currentPrice: number = 0;
  chartOptions!: AgChartOptions;
  stock!: Stock;
  sharesDict!: Record<string, number>;
  buyForm = new FormGroup({
    quantity: new FormControl(1, [Validators.required, integerValidator(), maxSharesValidator(() => this.sharesDict || [], this.stock?.stockInfo.symbol || '', this.buyTab)]),
  })
  wallet!: WalletDetails;

  constructor(
    private walletService: WalletService,
    private stockPriceService: StockPriceService, 
    private themeService: ThemeService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}


  get quantityInvalid() {
    const control = this.buyForm.get('quantity');
    return control && control.invalid && (control.dirty || control.touched);
  }

  get quantityNonInt() {
    const control = this.buyForm.get('quantity');
    return control && control.invalid && control.hasError('pattern')
  }

  get quantity() {
    return this.buyForm.get('quantity')?.value;
  }

  setBuying(state: boolean) {
    this.buyTab = state;
    
    this.buyForm.controls['quantity'].setValidators([
      Validators.required,
      integerValidator(),
      maxSharesValidator(() => this.sharesDict, this.stock?.stockInfo.symbol || '', this.buyTab)
    ]);
    this.buyForm.controls['quantity'].updateValueAndValidity();
  }

  onSubmit() {
    if (this.buyForm.invalid) {
      return;
    }

    if (this.buyTab == true) {
      this.walletService.purchaseShares(
        { 
          symbol: this.stock.stockInfo.symbol,
          quantity: Number(this.buyForm.value.quantity) ?? 0, 
        }).subscribe({
          next: () => {
            alert('Successfully purchased!')
            this.router.navigate(['/wallet/', this.wallet.wallet.name]);
          }, error: (err: Error) => {
            console.log(err);
          }
        });
    } else {
      this.walletService.sellShares(
        { 
          symbol: this.stock.stockInfo.symbol,
          quantity: Number(this.buyForm.value.quantity) ?? 0, 
        }).subscribe({
          next: () => {
            alert('Successfully sold!')
            this.router.navigate(['/wallet/', this.wallet.wallet.name]);
          }, error: (err: Error) => {
            console.log(err);
          }
        });
    }
    
  }

  updateChartOptions() {
    if (!this.stock || !isPlatformBrowser(this.platformId)) return;

    this.chartOptions = {
      data: this.stock.prices.map(entry => ({
        day: this.stockPriceService.formatDate(entry.date),
        price: entry.closing_price
      })).reverse(),

      series: [
        {
          type: 'line',
          xKey: 'day',
          yKey: 'price',
          connectMissingData: true,
          marker: {
            enabled: false,
          },
          tooltip: { renderer: renderer },
          //stroke: this.darkMode && "#208a09" || "#2196f3"
        }
      ],
      
      axes: [
        {
          type: 'category',
          position: 'bottom',
          label: {
            color: this.darkMode ? '#B8BBC1' : '#000000',
          },
          line: {
            stroke: this.darkMode ? '#3B3D3F' : '#E0EAF1',
          }
        },
        {
          type: 'number',
          position: 'left',
          label: {
            color: this.darkMode ? '#B8BBC1' : '#000000',
          },
          gridLine: {
            style: [
              {
                  stroke: this.darkMode ? '#3B3D3F' : '#C3C3C3',
              },
              ],
          },
        }
      ],
      background: {
        fill: "transparent",
      },
    };
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
      this.updateChartOptions();
    });

    const symbol = this.route.snapshot.paramMap.get('symbol');
    if (symbol) {
      this.stockPriceService.getStockInfo(symbol).subscribe({
        next: (data: Stock) => {
          this.stock = data;
          this.currentPrice = Math.round((this.stock.prices[this.stock.prices.length - 1].closing_price + Number.EPSILON) * 100) / 100;
          this.updateChartOptions();
        }, error: (err: Error) => {
          console.log(err);
        }
      });

    }

    this.walletService.getSelectedWallet().subscribe({
      next: (wallet: WalletDetails) => {
        this.wallet = wallet;
        this.sharesDict = this.walletService.getSharesCountDictionary(this.wallet.shares)
        
        this.buyForm.controls['quantity'].setValidators([
          Validators.required,
          integerValidator(),
          maxSharesValidator(() => this.sharesDict, this.stock?.stockInfo.symbol || '', this.buyTab)
        ]);
        this.buyForm.controls['quantity'].updateValueAndValidity();
      }
    })
  }
}
