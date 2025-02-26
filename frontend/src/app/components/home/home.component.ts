import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule],
  providers: []
})
export class HomeComponent {

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken() == null) {
      this.router.navigate(['/stocks']);
    } else {
      this.walletService.getSelectedWalletName().subscribe({
        next: (name: string) => {
          this.router.navigate(['/wallet/', name]);
        }, error: (err: Error) => {
          this.router.navigate(['/profile']);
        }
      })
      
    }
  }
}
