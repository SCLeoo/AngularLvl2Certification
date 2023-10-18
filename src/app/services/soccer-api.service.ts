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
  teamID = '';
  teamName = '';
  currFixtures = [] as Fixture[];
  fixtures$ = new Subject<Fixture[]>();
  useLocalStorage = true; //TODO: change to false on prod

  constructor(private http: HttpClient, private router: Router) {
    console.log(this.currYear);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const pathArr = location.pathname.split('/');
        const id = pathArr[pathArr.length - 1];
        const section = pathArr[1];
        if (section == 'teams') {
          this.updateTeam(id);
        } else if (section == 'standings') {
          this.updateLeague(id ?? '39');
        } else if (id != 'error') {
          router.navigate(['/standings/39']);
        }
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

  updateTeam(newTeamID: string) {
    if (this.teamID != newTeamID || !this.currFixtures) {
      this.teamID = newTeamID;
      if (this.currLeague.standings)
        this.teamName =
          this.currLeague.standings![0]?.find(
            (standing) => standing.team.id.toString() == this.teamID
          )?.team.name ?? '';
      this.fetchTeam();
    }
  }
  getTeamName() {
    return this.teamName;
  }

  fetchTeam() {
    console.log('Fetching ' + this.teamID);
    if (this.useLocalStorage) {
      this.currFixtures =
        (JSON.parse(
          localStorage.getItem('team' + this.teamID) ?? '{}'
        ) as Fixture[]) ?? ([] as Fixture[]);
    }
    //console.log(this.currFixtures);
    if (!this.useLocalStorage || !this.currFixtures[0]) {
      const params = new HttpParams()
        .set('season', this.currYear)
        .set('team', this.teamID);
      this.http
        .get('https://v3.football.api-sports.io/fixtures', { params })
        .subscribe((res: Response) => {
          if (res.errors!.bug || res.message || !res.response![0]) {
            this.router.navigate(['/error']);
          } else {
            this.currFixtures = res.response as Fixture[];
            this.teamName =
              res.response![0].teams?.away.id.toString() == this.teamID
                ? res.response![0].teams?.away.name
                : res.response![0].teams?.home.name ?? '';
            localStorage.setItem(
              'team' + this.teamID,
              JSON.stringify(this.currFixtures)
            );

            this.fixtures$.next(this.currFixtures);
          }
        });
    } else {
      this.teamName =
        this.currFixtures[0].teams?.away.id.toString() == this.teamID
          ? this.currFixtures[0].teams?.away.name
          : this.currFixtures[0].teams?.home.name ?? '';
      this.fixtures$.next(this.currFixtures);
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
