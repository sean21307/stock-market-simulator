import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-ai-stock-modal',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './ai-stock-modal.component.html',
  styleUrls: ['./ai-stock-modal.component.css']
})
export class AiStockModalComponent implements OnInit {
  @Input() stockSymbol: string = '';  
  prediction: any = null;
  errorMessage: string = '';
  isLoading: boolean = true;
  predictionCollapsed: boolean = true;  

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
    if (this.stockSymbol) {
      this.fetchPricePrediction();
    }
  }

  fetchPricePrediction(): void {
    this.isLoading = true;
    this.predictionService.getPricePrediction(this.stockSymbol).subscribe(
      (response) => {
        this.prediction = response;
        this.errorMessage = '';
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching price prediction: ' + error.message;
        this.prediction = null;
        this.isLoading = false;
      }
    );
  }
}
