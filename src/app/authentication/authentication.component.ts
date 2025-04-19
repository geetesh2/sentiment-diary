import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  isSignup = false;
  email = '';
  password = '';

  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userService.logOut();
  }
  
  toggleMode() {
    this.isSignup = !this.isSignup;
  }

  onSubmit() {
    if (this.isSignup) {
      this.userService.signUp(this.email, this.password);
    } else {
      this.userService.logInUser(this.email, this.password);
    }
  }
}
