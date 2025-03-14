import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NewsService } from '../../services/news.service';
import { ThemeService } from '../../services/theme.service'; 

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  private themeService = inject(ThemeService); 
  generalNews: any[] = [];
  darkMode = false; 

  ngOnInit(): void {
    this.fetchGeneralNews();

    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });
  }

  fetchGeneralNews(): void {
    this.newsService.getGeneralNews().subscribe({
      next: (data) => this.generalNews = data,
      error: (err) => console.error('Error fetching general news:', err)
    });
  }
}
