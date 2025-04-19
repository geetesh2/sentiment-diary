import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private userSubject = new BehaviorSubject<boolean>(this.loggedIn);
  user$ = this.userSubject.asObservable();
  private router = inject(Router);

  constructor(private http: HttpClient) {
    this.restoreLogin(); // Check and restore login state on service initialization
  }

  private restoreLogin() {
    const idToken = localStorage.getItem('idToken');
    const localId = localStorage.getItem('localId');

    if (idToken && localId) {
      this.loggedIn = true;
      this.userSubject.next(this.loggedIn);
    }
  }

  logIn() {
    this.loggedIn = true;
    this.userSubject.next(this.loggedIn);
    this.router.navigate(['/diary-entry']);
  }

  logOut() {
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('localId');
    localStorage.removeItem('email');

    this.loggedIn = false;
    this.userSubject.next(this.loggedIn);
    this.router.navigate(['/login']);
  }

  signUp(email: string, password: string) {
    const payload = { email, password, returnSecureToken: true };
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;

    return this.http.post<any>(signUpUrl, payload).subscribe(
      (response) => {
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('localId', response.localId);
        localStorage.setItem('email', response.email);

        this.logIn();
      },
      (error) => {
        console.error('Error during signup:', error);
      }
    );
  }

  logInUser(email: string, password: string) {
    const payload = { email, password, returnSecureToken: true };
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;

    return this.http.post<any>(signInUrl, payload).subscribe(
      (response) => {
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('localId', response.localId);
        localStorage.setItem('email', response.email);

        this.logIn();
      },
      (error) => {
        console.error('Error during login:', error);
      }
    );
  }
}
