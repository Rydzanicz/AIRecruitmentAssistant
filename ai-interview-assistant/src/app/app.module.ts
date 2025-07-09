import {NgModule} from '@angular/core';
import {provideRouter} from '@angular/router';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {DashboardComponent} from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppComponent,
    HttpClientModule,
    DashboardComponent
  ],
  providers: [],
})
export class AppModule {
  static bootstrap() {
    return bootstrapApplication(AppComponent, {
      providers: [provideRouter([])]
    });
  }
}
