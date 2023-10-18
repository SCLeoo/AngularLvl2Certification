import { Component } from '@angular/core';
import { Fixture, SoccerAPIService } from 'src/app/services/soccer-api.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent {
  fixtures = [] as Fixture[];
  teamName = '';

  constructor(private soccerAPI: SoccerAPIService) {}

  ngOnInit() {
    if (this.soccerAPI.currFixtures[0])
      this.fixtures = this.soccerAPI.currFixtures;
    this.soccerAPI.fixtures$.subscribe((res) => {
      this.fixtures = res;
    });
  }
  getLast10(): Fixture[] {
    let last10 = [];
    let i = 0;
    while (last10.length < 10 && i < this.fixtures.length) {
      if (
        ['FT', 'AET', 'PEN'].includes(this.fixtures[i].fixture!.status!.short!)
      )
        last10.push(this.fixtures[i]);
      i++;
    }
    return last10;
  }
}
