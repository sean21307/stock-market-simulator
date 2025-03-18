import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../models/wallet.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { SearchResult } from '../../models/searchResult.model';
import { StockPriceService } from '../../services/stock-price.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, DropdownComponent, RouterModule],
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
  searchQuery = '';
  searchResults: SearchResult[] = [];
  searchSubject = new Subject<string>();
  isFocused: boolean = false;

  constructor(
    private themeService: ThemeService, 
    private walletService: WalletService, 
    private authService: AuthService, 
    private stockService: StockPriceService,
    private router: Router,
    private http: HttpClient
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(query => this.stockService.getSearchResults(query))
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  onSearchChange() {
    if (this.searchQuery.trim().length == 0) {
      this.searchResults = [];
      return;
    }
    this.searchSubject.next(this.searchQuery);
  }

  onFocus() {
    this.isFocused = true;
  }
  
  onBlur() {
    // timeout required to allow page to navigate
    setTimeout(() => {
      this.isFocused = false;
    }, 100);
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });
    

    
    if (this.authService.getToken() != null) {
      this.loggedIn = true;
      this.getWallets(); // only need to request wallets if you're logged in

      this.walletService.getSelectedWalletName().subscribe(walletName => {
        this.selectedWallet = walletName;
      });
    }
  }

  get selectedWalletText(): string {
    return this.selectedWallet.length == 0 ? 'Wallets' : this.selectedWallet
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

  changeWallet(walletName: string) {
    if (walletName == 'New') {
      this.router.navigate(['/wallet/new'])
      console.log('Make new wallet');
    } else {
      this.walletService.setSelectedWallet(walletName).subscribe({
        next: (data: { wallet_id: number }) => {
          window.location.reload();
        }, error: (err: Error) => {
          alert('Failed to select wallet. See console for error.');
          console.log(err);
        }
      })
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
