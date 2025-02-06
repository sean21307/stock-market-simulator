import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Stock } from '../../models/stock.model';
import { StockPriceService } from '../../services/stock-price.service';
import { CardComponent } from "../card/card.component";

import { AgCharts } from 'ag-charts-angular';
import { AgCartesianSeriesTooltipRendererParams, AgChartOptions, AgLineSeriesTooltipRendererParams } from 'ag-charts-types';


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
        value: datum[yKey].toFixed(2),
      },
    ],
  };
}

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CardComponent, AgCharts],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css',
})
export class StockDetailsComponent {
  private readonly route = inject(ActivatedRoute);

  currentPrice: number = 0;
  chartOptions!: AgChartOptions;
  stock!: Stock;

  constructor(private stockPriceService: StockPriceService) {}

  ngOnInit() {
    const symbol = this.route.snapshot.paramMap.get('symbol');
    if (symbol) {
      this.stockPriceService.getStockInfo(symbol).subscribe((data: Stock) => {
        this.stock = data;
        this.currentPrice = Math.round((this.stock.prices[this.stock.prices.length - 1].closing_price + Number.EPSILON) * 100) / 100;
        console.log(this.stock);
        
        this.chartOptions = {
          data: this.stock.prices.map(entry => ({
            day: this.stockPriceService.formatDate(entry.date),
            price: entry.closing_price 
          })),
    
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
            }
          ],
          background: {
            fill: "#ffffff",
          },
        };
      });
    }
  }
}
