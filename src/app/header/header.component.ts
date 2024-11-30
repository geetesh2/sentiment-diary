import { Component, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../service/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DiaryService } from '../service/diary.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule,MatToolbarModule,RouterModule,MatIconModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {

  buttonText: string = 'Diary Entries';
  isLoggedIn: boolean = false;
  isSmallScreen: boolean = false;
  isSidenavOpen: boolean = false;

  constructor(
    private router: Router,
    private userService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private diaryService:DiaryService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });

    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.buttonText = currentRoute.includes('diary-entry')
        ? 'Mood Trends'
        : 'Diary Entry';
    });
  }

  navigate() {
    const targetRoute =
      this.buttonText === 'Diary Entry'
        ? '/diary-entry'
        : '/mood-trends';
    this.router.navigate([targetRoute]);
  }

  logout() {
    this.userService.logOut();
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  ngOnDestroy(): void {
    this.diaryService.diarySubject.next([]);
    this.userService.logOut();
  }

}
