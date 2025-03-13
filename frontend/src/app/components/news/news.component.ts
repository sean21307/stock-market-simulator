import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  generalNews: any[] = [];
  stockNews: any[] = [];
  selectedStock = 'AAPL'; // Default stock symbol

  ngOnInit(): void {
    this.fetchGeneralNews();
    this.fetchStockNews(this.selectedStock);
  }

  fetchGeneralNews(): void {
    this.newsService.getGeneralNews().subscribe({
      next: (data) => this.generalNews = data,
      error: (err) => console.error('Error fetching general news:', err)
    });
  }

  fetchStockNews(symbol: string): void {
    this.newsService.getStockNews(symbol).subscribe({
      next: (data) => this.stockNews = data,
      error: (err) => console.error('Error fetching stock news:', err)
    });
  }
}
