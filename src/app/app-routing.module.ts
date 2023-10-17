import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { StandingsComponent } from './pages/standings/standings.component';

const routes: Routes = [
  {
    path: 'standings',
    redirectTo: 'standings/39',
  },
  {
    path: 'standings/:id',
    component: StandingsComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '*',
    redirectTo: 'standings',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
