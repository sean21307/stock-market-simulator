import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastNotificationComponent } from "./components/toast-notification/toast-notification.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
