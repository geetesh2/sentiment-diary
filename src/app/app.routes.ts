import { Routes } from '@angular/router';
import { DiaryEntryComponent } from './diary/diary.component';
import { TrendsComponent } from './trends/trends.component';
import { AuthenticationComponent } from './authentication/authentication.component';

export const routes: Routes = [
      { path: 'diary-entry', component: DiaryEntryComponent },
      { path: 'mood-trends', component: TrendsComponent },
  { path: 'login', component: AuthenticationComponent },
  { path: '', redirectTo: '/diary-entry', pathMatch: 'full' }, // Redirect default route
  { path: '**', redirectTo: '/diary-entry' }, // Redirect unknown routes
    ];
