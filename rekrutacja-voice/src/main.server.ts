import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () =>
  bootstrapApplication(App, {
    ...config,
    providers: [
      ...(config.providers ?? []),
      provideHttpClient(withFetch()) // lub provideHttpClient() bez withFetch, jeśli nie używasz SSR
    ]
  });

export default bootstrap;
