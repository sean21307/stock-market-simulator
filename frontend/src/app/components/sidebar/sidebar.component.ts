import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { DropdownComponent } from "../dropdown/dropdown.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, DropdownComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  showSidebar = true;
  darkMode = false;
  selectedWallet = 'Wallet 1';
  walletDropdownOpen = false;
  wallets = ['Wallet 1', 'Wallet 2'];

  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });
  }

  changeWallet(wallet: string) {
    this.selectedWallet = wallet;
    // window.location.reload();
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  toggleDarkMode(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.themeService.updatePageTheme(inputElement.checked);
  }
}
