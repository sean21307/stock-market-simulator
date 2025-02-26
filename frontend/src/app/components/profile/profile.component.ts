import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Wallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet.service';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CardComponent, TitleCasePipe, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  selectedWallet!: string;
  wallets!: Wallet[];
  walletPage = 1;
  WALLET_PAGE_SIZE = 6;
  

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private router: Router
  ) {}

  get totalPages() {
    return Math.ceil(this.wallets.length / this.WALLET_PAGE_SIZE);
  }

  get walletPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  incrementWalletPage() {
    this.walletPage = Math.min(this.walletPage + 1, this.totalPages);
  }

  setWalletPage(num: number) {
    this.walletPage = num;
  }

  decrementWalletPage() {
    this.walletPage = Math.max(this.walletPage - 1, 1);
    console.log(this.walletPage);
  }

  routeToWalletPage(name: string) {
    this.router.navigate(['/wallet/', name]);
  }

  sortWallets() {
    if (this.wallets) {
      this.wallets.sort((a, b) => (a.name === this.selectedWallet ? -1 : b.name === this.selectedWallet ? 1 : 0));
    }
  }

  ngOnInit() {
    console.log(this.authService.getToken());
    if (this.authService.getToken() == null) {
      //this.router.navigate(['/auth']);
      //return;
    }

    this.walletService.getWallets().subscribe({
      next: (data: Wallet[]) => {
        this.wallets = data;
        this.sortWallets();
      }, error: (err: Error) => {
        console.log(err);
      }
    })

    this.walletService.getSelectedWalletName().subscribe(walletName => {
      this.selectedWallet = walletName;
      this.sortWallets();
    });
  }
}
