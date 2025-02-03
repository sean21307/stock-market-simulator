import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../card/card.component";

import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { StockPriceService } from '../../services/stock-price.service';



type stockData = {
  date: string,
  closing_price: string
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, AgCharts],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  chartOptions!: AgChartOptions;
  stockDataArray: stockData[] = [];

  constructor(private stockPriceService: StockPriceService) {
    
  }

  ngOnInit() {
    // mock data

    this.stockPriceService.getStockPrices('AAPL').subscribe(data => {
      this.stockDataArray = data;
      console.log(this.stockDataArray);
    });

    const transformedData = this.stockDataArray.map(entry => ({
      day: this.stockPriceService.formatDate(entry.date),
      price: entry.closing_price
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
