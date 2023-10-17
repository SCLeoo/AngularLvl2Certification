import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoccerAPIService {
  leagueID = '';
  currYear = new Date().getFullYear();
  currLeague = {} as League;
  league$ = new Subject<League>();
  useLocalStorage = true; //TODO: change to false on prod

  constructor(private http: HttpClient, private router: Router) {
    console.log(this.currYear);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLeague(location.pathname.split('/').pop() ?? '39');
      }
    });
  }

  updateLeague(newLeagueID: string) {
    if (this.leagueID != newLeagueID || !this.currLeague) {
      this.leagueID = newLeagueID;
      this.fetchLeague();
    }
  }

  fetchLeague() {
    console.log('Fetching ' + this.leagueID);
    if (this.useLocalStorage) {
      this.currLeague =
        (JSON.parse(
          localStorage.getItem('league' + this.leagueID) ?? '{}'
        ) as League) ?? ({} as League);
    }
    //console.log(this.currLeague);
    if (!this.useLocalStorage || !this.currLeague.id) {
      const params = new HttpParams()
        .set('season', this.currYear)
        .set('league', this.leagueID);
      this.http
        .get('https://v3.football.api-sports.io/standings', { params })
        .subscribe((res: Response) => {
          if (res.errors!.bug || res.message || !res.response![0]) {
            this.router.navigate(['/error']);
          } else {
            this.currLeague = res.response![0].league as League;
            localStorage.setItem(
              'league' + this.leagueID,
              JSON.stringify(this.currLeague)
            );
            this.league$.next(this.currLeague);
          }
        });
    } else {
      this.league$.next(this.currLeague);
    }
  }
}

export interface Response {
  errors?: {
    time: string;
    bug: string;
    report: string;
  };
  message?: string;
  response?: [{ league: League }];
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo?: string;
  flag?: string;
  season: number;
  standings: [Standings[]];
}

export interface Standings {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}
