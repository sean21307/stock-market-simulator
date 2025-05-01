import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-nav-bar.component.html',
  styleUrl: './table-nav-bar.component.css'
})
export class TableNavBarComponent implements OnInit {
  @Input() pageSize = 10;
  @Input() data: any[] = [];
  @Output() dataUpdated = new EventEmitter();
  currentPage = 1;

  get paginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }

    this.dataUpdated.emit(this.paginated)
  }

  ngOnInit() {
    setTimeout(() => this.dataUpdated.emit(this.paginated), 0);
  }
}
