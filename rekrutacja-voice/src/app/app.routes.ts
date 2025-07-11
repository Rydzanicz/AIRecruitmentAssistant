import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BodyComponent} from './Component/body/body.component';
import {SettingsComponent} from './settings/settings.component';
import {MeetingComponent} from './Component/meeting/meeting.component';

export const routes: Routes = [
  {path: '', component: BodyComponent},
  {path: 'settings', component: SettingsComponent},
  { path: 'meeting', component: MeetingComponent },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
