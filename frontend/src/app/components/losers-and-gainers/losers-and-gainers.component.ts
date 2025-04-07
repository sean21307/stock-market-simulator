import { Component } from '@angular/core';
import {LoserModel, WinnerModel} from "../../models/losers-gainers.model";
import {LosersGainersService} from "../../services/losers-gainers.service";

@Component({
  selector: 'app-losers-and-gainers',
  standalone: true,
  imports: [],
  templateUrl: './losers-and-gainers.component.html',
  styleUrl: './losers-and-gainers.component.css'
})
export class LosersAndGainersComponent {
  losers: LoserModel[] = []
  winners: WinnerModel[] = []

  constructor(private loserGainerService: LosersGainersService) {}

  ngOnInit(): void{

    this.loserGainerService.getLosers().subscribe((data => {
      this.losers = data;
    }))

    this.loserGainerService.getWinners().subscribe((data) => {
      this.winners = data
    })
  }
}
