import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletDetails } from '../../models/walletDetails.model';
import { WalletService } from '../../services/wallet.service';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet-details',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.css'
})
export class WalletDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  walletDetails!: WalletDetails;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.walletService.getWalletDetails(name).subscribe({
        next: (wallet: WalletDetails) => {
          this.walletDetails = wallet;
        }
      })
    }
  }
}
