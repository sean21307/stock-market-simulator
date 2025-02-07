// home.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Manually defined stock information
  stock1 = { symbol: 'AAPL', currentPrice: 236.0, change: 4 };
  stock2 = { symbol: 'GOOG', currentPrice: 1345.55, change: -12.3 };
  // Add more stock variables as needed

  constructor() {}

  ngOnInit(): void {}

}
