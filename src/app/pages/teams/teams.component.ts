import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Fixture, SoccerAPIService } from 'src/app/services/soccer-api.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent {
  teamFixtures = [] as Fixture[];
  readonly leagues = [
    { id: 39, country: 'England' },
    { id: 140, country: 'Spain' },
    { id: 61, country: 'France' },
    { id: 78, country: 'Germany' },
    { id: 135, country: 'Italy' },
  ];

  constructor(private soccerAPI: SoccerAPIService, private router: Router) {
    this.soccerAPI.teamFixturesRes$.subscribe((res) => {
      if (res.errors!.bug || res.message || !res.response![0]) {
        router.navigate(['/error']);
      } else {
        this.teamFixtures = res.response!;
        this.soccerAPI.lastUrl$.next(router.url);
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.split('/')[1] == 'teams')
          this.soccerAPI.getTeam(+event.urlAfterRedirects.split('/').pop()!);
      }
    });
  }
}
