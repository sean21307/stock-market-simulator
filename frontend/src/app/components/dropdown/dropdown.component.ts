import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Output() itemClicked = new EventEmitter<string>();
  @Input() selectedItem!: string;
  @Input() items!: string[];
  @Input() dropdownText = '';
  dropdownOpen = false;
  
  private wasInside = false;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.dropdownOpen = false;
    }
    this.wasInside = false;
  }

  onClick(item: string) {
    this.itemClicked.emit(item);
    this.dropdownOpen = false;
  }
}
