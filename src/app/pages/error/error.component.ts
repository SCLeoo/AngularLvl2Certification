import { Component } from '@angular/core';
import { SoccerAPIService } from 'src/app/services/soccer-api.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  constructor(private soccerApi: SoccerAPIService) {}
  goBack() {}
}
