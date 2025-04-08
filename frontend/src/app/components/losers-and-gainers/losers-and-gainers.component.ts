import { Component, Input } from '@angular/core';
import { BigChanger } from "../../models/losers-gainers.model";
import {LosersGainersService} from "../../services/losers-gainers.service";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-losers-and-gainers',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './losers-and-gainers.component.html',
  styleUrl: './losers-and-gainers.component.css'
})
export class LosersAndGainersComponent {
  losers!: BigChanger[];
  winners!: BigChanger[];
  toShow: BigChanger[] = [];
  @Input() showWinners = true;

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
