import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-watchlist-modal',
  standalone: true,
  imports: [],
  templateUrl: './watchlist-modal.component.html',
  styleUrl: './watchlist-modal.component.css'
})
export class WatchlistModalComponent {
  @Input() isOpen = false;

  closeModal() {
    this.isOpen = false;
  }
}
