import { Component } from '@angular/core';
import { SoccerAPIService } from './services/soccer-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'AngularLvl2Certification';
  constructor(private soccerAPI: SoccerAPIService) {}
}
