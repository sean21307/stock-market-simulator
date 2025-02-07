import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'home', component: DashboardComponent },
    { path: 'stock/:symbol', component: StockDetailsComponent },
];
