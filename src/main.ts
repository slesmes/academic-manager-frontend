import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/pages/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/pages/app-routing.module';
import { provideHttpClient} from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
}).catch(err => console.error(err));