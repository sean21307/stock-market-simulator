import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-news-stock-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  
  templateUrl: './news-stock-modal.component.html',
  styleUrls: ['./news-stock-modal.component.css']
})
export class NewsStockModalComponent implements OnInit {
  private newsService = inject(NewsService);
  @Input() stockSymbol: string = ''; 
  stockNews: any[] = []; 
  isLoading = false; 
  errorMessage = '';
  newsCollapsed = false;
  
  ngOnInit(): void {
    if (this.stockSymbol) {
      this.fetchStockNews();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockSymbol'] && changes['stockSymbol'].currentValue) {
      this.fetchStockNews();
    }
  }

  fetchStockNews(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.newsService.getStockNews(this.stockSymbol).subscribe(
      (news) => {
        this.stockNews = news;
        this.isLoading = false;
      },
      () => {
        this.errorMessage = 'Failed to load stock news';
        this.isLoading = false;
      }
    );
  }
}
