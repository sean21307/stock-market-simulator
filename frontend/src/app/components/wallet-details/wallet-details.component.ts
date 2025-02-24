import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet-details',
  standalone: true,
  imports: [],
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.css'
})
export class WalletDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      // will wallets/Sean's Thing work fine for getting details or do we need to use id?
      console.log(name);
    }
  }
}
