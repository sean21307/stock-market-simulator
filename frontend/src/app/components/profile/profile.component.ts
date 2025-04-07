import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Wallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { ModalComponent } from '../modal/modal.component';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CardComponent, TitleCasePipe, CommonModule,ReactiveFormsModule, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  selectedWallet!: string;
  wallets!: Wallet[];
  walletPage = 1;
  WALLET_PAGE_SIZE = 6;
  deleteWalletModalOpen = false;
  deleteWalletName: string | undefined = undefined;

  user: { username: string; email: string } | null = null;
   profileForm!: FormGroup;
   isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private walletService: WalletService,
    private router: Router,
    private notificationService: NotificationService
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

  promptDeleteWallet(name: string) {
    this.deleteWalletName = name;
    this.deleteWalletModalOpen = true;
  }

  deleteWallet() {
    if (!this.deleteWalletName) return;

    this.walletService.deleteWallet(this.deleteWalletName).subscribe({
      next: () => {
        if (!this.deleteWalletName) return;
        this.wallets = this.wallets.filter((wallet) => wallet.name != this.deleteWalletName);
        this.deleteWalletModalOpen = false;
      },
      error: (err: Error) => {
        this.notificationService.addNotification({variant: 'danger', title:'Oops!', message:'Something went wrong when deleting wallet. Please try again.'}) 
        console.error('Error deleting wallet:', err);
        this.deleteWalletModalOpen = false;
      },
    });
  }

  ngOnInit() {
    console.log(this.authService.getToken());
    if (this.authService.getToken() == null) {
      this.router.navigate(['/auth']);
      return;
    }

    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true, }],
      email: [{ value: '', disabled: true }]
    });

    this.authService.getUserProfile().subscribe(
      (userData) => {
        console.log("User profile:", userData);
        this.user = userData;

        this.profileForm.patchValue({
          username: userData.username,
          email: userData.email
        });
      },
      (error) => {
        console.error("Failed to fetch user profile", error);
        alert("Error loading profile data");
      }
    );

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

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.profileForm.get('username')?.enable();
      this.profileForm.get('email')?.enable();
    } else {
      this.profileForm.get('username')?.disable();
      this.profileForm.get('email')?.disable();
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.notificationService.addNotification({variant: 'warning', title:'Invalid Form Data', message:'Please enter valid data and try again.'}) 
      return;
    }

  const updatedProfile = this.profileForm.value;

  this.authService.updateUserProfile(updatedProfile).subscribe(
    (response) => {
      console.log("Profile updated:", response);
      this.notificationService.addNotification({variant: 'success', title:'Success!', message:'Your profile changes have been saved successfully.'}) 
      this.toggleEdit(); // Exit edit mode
    },
    (error) => {
      this.notificationService.addNotification({variant: 'danger', title:'Oops!', message:'Something went wrong when updating profile. Please try again.'}) 
      console.error("Failed to update profile", error);
    }
  );
  }
}
