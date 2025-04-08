import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockPriceService } from '../../services/stock-price.service';
import { CardComponent } from "../card/card.component";
import { DropdownComponent } from "../dropdown/dropdown.component";
import { AllStock } from '../../models/allStocks.model';
import {LosersAndGainersComponent} from "../losers-and-gainers/losers-and-gainers.component";

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, DropdownComponent, LosersAndGainersComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  stocks: AllStock[] = [];
  selectedTab = "stocks";

  constructor(private stockService: StockPriceService) {}

  selectTab(name: string) {
    this.selectedTab = name;
  }

  ngOnInit(): void {
    this.stockService.getAllStocks().subscribe((data) => {
      this.stocks = data;
    });
  }
}
