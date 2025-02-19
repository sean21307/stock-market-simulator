import { Routes } from '@angular/router';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'stock/:symbol', component: StockDetailsComponent },
    { path: 'auth', component: AuthComponent },


];
