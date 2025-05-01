import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";
import {LeaderboardEntry} from "../../models/leaderboard.model";
import {LeaderboardService} from "../../services/leaderboard.service";
import {Order} from "../../models/order.model";

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [
    RouterLinkActive,
    NgClass,
    RouterLink
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  leaderboardEntries!: LeaderboardEntry[];
  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.leaderboardService.getLeaderboard().subscribe(
      (response: LeaderboardEntry[]) => {
      this.leaderboardEntries = response;
    }, (err) => {
      console.error(err);
    })
  }
}
