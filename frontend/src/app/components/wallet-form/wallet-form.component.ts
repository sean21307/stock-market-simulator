import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../services/wallet.service';
import { Wallet } from '../../models/wallet.model';

@Component({
  selector: 'app-wallet-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './wallet-form.component.html',
  styleUrl: './wallet-form.component.css'
})
export class WalletFormComponent {
  walletForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  })

  constructor(private router: Router, private walletService: WalletService) {}

  get name() {
    return this.walletForm.get('name');
  }

  get nameInvalid() {
    const control = this.walletForm.get('name');
    return control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.walletForm.invalid) {
      return;
    }

    this.walletService.createWallet(
      { 
        name: this.name?.value ?? '', 
        description: this.walletForm.get("description")?.value ?? '' 
    }).subscribe({
      next: (data: Wallet) => {
        alert('Successfully created wallet!')
        this.router.navigate([`/wallet/${data.name}`]);
      }, error: (err: Error) => {
        alert('Wallet already exists with that name.');
        console.log(err);
      }
    });
  }
}
