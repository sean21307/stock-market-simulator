import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../card/card.component";

import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { StockPriceService } from '../../services/stock-price.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, AgCharts],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  chartOptions!: AgChartOptions;
  stockData: { day: string, price: number }[] = [];

  constructor(private stockPriceService: StockPriceService) {
    
  }

  ngOnInit() {
    // mock data
    this.stockData = [
      { day: '2024-02-02', price: 184.94395446777344 },
      { day: '2024-02-05', price: 188.32736786854025 },
      { day: '2024-02-06', price: 188.38708201253658 },
      { day: '2024-02-07', price: 190.11859155018027 },
      { day: '2024-02-08', price: 188.6159548348253 },
      { day: '2024-02-09', price: 189.30503301755343 },
      { day: '2024-02-12', price: 187.98977434952795 },
    ]

    const transformedData = this.stockData.map(entry => ({
      day: this.stockPriceService.formatDate(entry.day),
      price: entry.price
    }));

    this.chartOptions = {
      data: transformedData,

      series: [
        { 
          type: 'line', 
          xKey: 'day', 
          yKey: 'price',
          connectMissingData: true,
          // interpolation: {
          //   type: 'smooth',
          // }
        }
      ],
      background: {
        fill: "#ffffff",
      }
    };
  }
}
