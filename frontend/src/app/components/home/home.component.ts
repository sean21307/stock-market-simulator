import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Required for pipes and directives
import { RouterModule } from '@angular/router'; // Import RouterModule to enable routing
import { StockPriceService } from '../../services/stock-price.service';

@Component({
  selector: 'app-home',
  standalone: true, // ✅ This tells Angular it's a standalone component
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule], // ✅ Include RouterModule here to use routerLink
  providers: [StockPriceService] // ✅ If needed, provide the service
})
export class HomeComponent {
  stocks: any[] = [];

  constructor(private stockService: StockPriceService) {}

  ngOnInit(): void {
    this.stockService.getAllStocks().subscribe((data) => {
      this.stocks = data;
    });
  }
}
