import { Component } from '@angular/core';
import {
  SoccerAPIService,
  Standings,
} from 'src/app/services/soccer-api.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent {
  readonly leagues = [
    { id: 39, country: 'England' },
    { id: 140, country: 'Spain' },
    { id: 61, country: 'France' },
    { id: 78, country: 'Germany' },
    { id: 135, country: 'Italy' },
  ];
  standings = [] as Standings[];

  constructor(private soccerAPI: SoccerAPIService) {}

  ngOnInit() {
    this.standings = this.soccerAPI.currLeague.standings[0];
    this.soccerAPI.league$.subscribe((res) => {
      this.standings = res.standings[0];
    });
  }

  onLeagueClick(id: number) {
    this.soccerAPI.updateLeague(id.toString());
  }
}
