import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { League, SoccerAPIService } from 'src/app/services/soccer-api.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent {
  league = {} as League;
  readonly leagues = [
    { id: 39, country: 'England' },
    { id: 140, country: 'Spain' },
    { id: 61, country: 'France' },
    { id: 78, country: 'Germany' },
    { id: 135, country: 'Italy' },
  ];

  constructor(private soccerAPI: SoccerAPIService, private router: Router) {
    this.soccerAPI.leagueRes$.subscribe((res) => {
      if (res.errors!.bug || res.message || !res.response![0]) {
        router.navigate(['/error']);
      } else {
        this.league = res.response![0].league!;
        this.soccerAPI.lastUrl$.next(router.url);
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.split('/')[1] == 'standings')
          this.soccerAPI.getLeagueStandings(
            +event.urlAfterRedirects.split('/').pop()!
          );
      }
    });
  }
}
