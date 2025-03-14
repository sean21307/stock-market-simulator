import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Input() header: string = 'Confirmation';
  @Input() text: string = '';

  constructor() {}

  confirm() {
    this.submit.emit();
  }

  closeModal() {
    this.close.emit();
  }
}
