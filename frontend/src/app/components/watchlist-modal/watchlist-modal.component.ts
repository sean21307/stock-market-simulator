import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WatchlistService } from '../../services/watchlist.service';
import { Watchlist } from '../../models/watchlist.model';

@Component({
  selector: 'app-watchlist-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './watchlist-modal.component.html',
  styleUrl: './watchlist-modal.component.css'
})
export class WatchlistModalComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() symbol: string | null = null;
  lists!: Record<string, string[]>;
  originalLists!: Record<string, string[]>;

  get keys() {
    return Object.keys
  }

  watchlistForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })

  constructor(private watchlistService: WatchlistService) {}

  ngOnInit(): void {
      if (this.symbol) {
        this.watchlistService.getWatchlists().subscribe({
          next: (data: Record<string, string[]>) => {
            this.lists = data;
            this.originalLists = JSON.parse(JSON.stringify(data));
          }
        })
      }
  }

  toggleStock(name: string, eventTarget: EventTarget | null) {
    if (!this.symbol) return;
    if (!eventTarget) return;

    if ((eventTarget as HTMLInputElement).checked) {
      if (!this.lists[name].includes(this.symbol)) {
        this.lists[name].push(this.symbol);
      }
    } else {
      this.lists[name] = this.lists[name].filter(s => s !== this.symbol);
    }
  }

  saveChanges() {
    if (!this.symbol) return;
  
    const addRequests = [];
    const removeRequests = [];
  
    for (const name of Object.keys(this.lists)) {
      const originallyHadSymbol = this.originalLists[name]?.includes(this.symbol);
      const nowHasSymbol = this.lists[name]?.includes(this.symbol);
  
      if (nowHasSymbol && !originallyHadSymbol) {
        addRequests.push(this.watchlistService.addStockToWatchlist(name, this.symbol));
      } else if (!nowHasSymbol && originallyHadSymbol) {
        removeRequests.push(this.watchlistService.removeStockFromWatchlist(name, this.symbol));
      }
    }
  
    Promise.all([...addRequests, ...removeRequests].map(req => req.toPromise()))
      .then(() => {
        this.closeModal();
      })
      .catch(err => {
        alert('Something went wrong. Check console for details.');
        console.error(err);
      });
  }
  
  

  onSubmit() {
    if (this.watchlistForm.invalid) return;
    


    this.watchlistService.createWatchlist(
      { 
        name: this.watchlistForm?.get('name')?.value ?? '', 
      }
    ).subscribe({
      next: (data: Watchlist) => {
        window.location.reload();
        this.closeModal();
      },
      error: (err: Error) => {
        alert('Something went wrong. Check console for more information.');
        console.log(err);
        this.closeModal();
      }
    })
  }

  closeModal() {
    this.close.emit();
  }
}
