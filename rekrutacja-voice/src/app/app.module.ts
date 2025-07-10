import {NgModule} from '@angular/core';
import {provideRouter} from '@angular/router';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {SettingsComponent} from './settings/settings.component';
import {AppRoutingModule} from './app.routes';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SettingsComponent,
    AppComponent,
    HttpClientModule
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
