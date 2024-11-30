import { Routes } from '@angular/router';
import { DiaryEntryComponent } from './diary/diary.component';
import { TrendsComponent } from './trends/trends.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AnalysisComponent } from './analysis/analysis.component';

export const routes: Routes = [
  { path: 'diary-entry', component: DiaryEntryComponent },
  { path: 'mood-trends', component: TrendsComponent },
  { path: 'login', component: AuthenticationComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect default route
  { path: '**', redirectTo: '/login' }, // Redirect unknown routes
];
