import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  showSidebar = true;
  darkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  toggleDarkMode(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.themeService.updatePageTheme(inputElement.checked);
  }
}
