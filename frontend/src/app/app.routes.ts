import { Routes } from '@angular/router';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WalletFormComponent } from './components/wallet-form/wallet-form.component';
import { WalletDetailsComponent } from './components/wallet-details/wallet-details.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'stock/:symbol', component: StockDetailsComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'wallet/new', component: WalletFormComponent },
    { path: 'wallet/:name', component: WalletDetailsComponent },
];
