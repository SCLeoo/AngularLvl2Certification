import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { StandingsComponent } from './pages/standings/standings.component';
import { TeamsComponent } from './pages/teams/teams.component';

const routes: Routes = [
  {
    path: 'standings/:id',
    component: StandingsComponent,
  },
  {
    path: 'teams/:id',
    component: TeamsComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '**',
    redirectTo: 'standings/39',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
