import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-ai-general-modal',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './ai-general-modal.component.html',
  styleUrl: './ai-general-modal.component.css'
})
export class AiGeneralModalComponent implements OnInit {
  prediction: any = null;
  errorMessage: string = '';
  isLoading: boolean = true;
  predictionCollapsed: boolean = true;  

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
      this.fetchPricePrediction();
  }

  fetchPricePrediction(): void {
    this.isLoading = true;
    this.predictionService.getGeneralPricePrediction().subscribe(
      (response) => {
        this.prediction = response;
        this.errorMessage = '';
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching prediction: ' + error.message;
        this.prediction = null;
        this.isLoading = false;
      }
    );
  }
}

