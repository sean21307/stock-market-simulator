import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipsService } from '../../services/tips.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tips.component.html',
  styleUrl: './tips.component.css' // Optional: remove if unused
})
export class TipsComponent implements OnInit {
  tips: string[] = [];
  currentIndex: number = 0;
  isLoading: boolean = true;
  darkMode = false;

  private themeService = inject(ThemeService);

  constructor(private tipsService: TipsService) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });

    this.tipsService.getInvestingTips().subscribe({
      next: (response) => {
        this.tips = response.tips;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Failed to fetch tips", error);
        this.isLoading = false;
      }
    });
  }

  nextTip(): void {
    if (this.currentIndex < this.tips.length - 1) {
      this.currentIndex++;
    }
  }

  prevTip(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
