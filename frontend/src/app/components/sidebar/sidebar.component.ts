import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../models/wallet.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  selectedWallet = '';
  walletDropdownOpen = false;
  wallets: Wallet[] = [];
  walletNames: string[] = [];
  loggedIn = false;

  constructor(
    private themeService: ThemeService, 
    private walletService: WalletService, 
    private authService: AuthService, 
    private router: Router,
  ) {}
  
  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });

    
    if (this.authService.getToken() != null) {
      this.loggedIn = true;
      this.getWallets(); // only need to request wallets if you're logged in
    }
  }

  getWallets() {
    this.walletService.getWallets().subscribe({
      next: (data: Wallet[]) => {
        this.wallets = data;
        this.walletNames = this.wallets.map(wallet => wallet.name);
        this.walletNames.push("New");
      }, error: (err: Error) => {
        console.log(err);
      }
    });
  }

  logout() {
    this.authService.logoutUser();
  }

  changeWallet(wallet: string) {
    if (wallet == 'New') {
      this.router.navigate(['/wallet/new'])
      console.log('Make new wallet');
    } else {
      this.selectedWallet = wallet;
      window.location.reload();
    }
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  toggleDarkMode(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.themeService.updatePageTheme(inputElement.checked);
  }
}
