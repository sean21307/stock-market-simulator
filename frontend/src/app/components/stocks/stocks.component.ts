import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockPriceService } from '../../services/stock-price.service';
import { CardComponent } from "../card/card.component";
import { DropdownComponent } from "../dropdown/dropdown.component";
import { AllStock } from '../../models/allStocks.model';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, DropdownComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  stocks: AllStock[] = [];

  constructor(private stockService: StockPriceService) {}

  ngOnInit(): void {
    this.stockService.getAllStocks().subscribe((data) => {
      this.stocks = data;
    });
  }
}
