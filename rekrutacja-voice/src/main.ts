import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () =>
  bootstrapApplication(App, {
    ...config,
    providers: [
      ...(config.providers ?? []),
      provideHttpClient()
    ]
  });

export default bootstrap;
