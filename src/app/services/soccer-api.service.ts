import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoccerAPIService {
  leagueRes$ = new Subject<Response>();
  teamFixturesRes$ = new Subject<Response>();
  teamName$ = new Subject<string>();
  lastUrl$ = new Subject<string>();
  useLocalStorage = true; //TODO: change to false on prod

  constructor(private http: HttpClient) {}

  httpGet(
    storage: Subject<Response>,
    endpoint: string,
    paramName: string,
    paramValue: number
  ) {
    const cached = localStorage.getItem(paramName + paramValue);
    let res: Response = {};
    if (!this.useLocalStorage || !cached) {
      const params = new HttpParams()
        .set('season', new Date().getFullYear())
        .set(endpoint == 'fixtures' ? 'last' : '', 10)
        .set(paramName, paramValue);
      this.http
        .get('https://v3.football.api-sports.io/' + endpoint, {
          params,
        })
        .subscribe((response) => {
          res = response;
          localStorage.setItem(
            paramName + paramValue,
            JSON.stringify(response)
          );
          storage.next(res);
        });
    } else {
      storage.next(JSON.parse(cached));
    }
  }

  getLeagueStandings(leagueID: number) {
    this.httpGet(this.leagueRes$, 'standings', 'league', leagueID);
    this.teamName$.next('');
  }

  getTeam(teamID: number) {
    this.httpGet(this.teamFixturesRes$, 'fixtures', 'team', teamID);
    this.teamName$.next('');
  }
}

export interface Response {
  errors?: {
    time: string;
    bug: string;
    report: string;
  };
  message?: string;
  response?: [Fixture];
}

export interface Fixture {
  teams?: { home: Team; away: Team };
  goals?: { home: number; away: number };
  league?: League;
  fixture?: { status?: { short?: string } };
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings?: [Standings[]];
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
  winner?: boolean;
}
