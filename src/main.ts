// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/pages/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/pages/app-routing.module';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));

