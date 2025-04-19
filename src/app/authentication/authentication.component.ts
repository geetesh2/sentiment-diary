import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-authentication',
  standalone: true,
  templateUrl: './authentication.component.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit
{
  isSignup = false;
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userService.logOut();
  }
  
  toggleMode() {
    this.isSignup = !this.isSignup;
  }

  onSubmit(form: any) {
    if (form.invalid) return;
  
    if (this.isSignup) {
      this.userService.signUp(this.email, this.password);
    } else {
      this.userService.logInUser(this.email, this.password);
    }
  }  
}
