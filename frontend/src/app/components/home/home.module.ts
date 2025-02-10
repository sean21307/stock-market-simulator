import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Enables pipes and directives like 'ngClass'
import { RouterModule } from '@angular/router'; // Import RouterModule to use 'routerLink'
import { HomeComponent } from '../../components/home/home.component';
import { DecimalPipe } from '@angular/common'; // ✅ Import DecimalPipe

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule, // ✅ Required for pipes (number, date, etc.) and directives (ngClass, ngIf, etc.)
    RouterModule // Add RouterModule here to enable routerLink
  ],
  providers: [DecimalPipe], // ✅ Provides DecimalPipe for use
  exports: [HomeComponent] // ✅ Export if needed in other modules
})
export class HomeModule { }
