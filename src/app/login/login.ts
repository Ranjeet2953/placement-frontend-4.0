import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Login {
  username = '';
  password = '';
  error = '';
  loading = false;
  success = false;

  constructor(private api: Api, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;
    this.success = false;
  
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.api.getMe().subscribe({
          next: (user: any) => {
            this.success = true;
            setTimeout(() => {
              if (user && user.roles && user.roles.includes('ADMIN')) {
                this.router.navigate(['/admin']);
              } else if (user && user.roles && user.roles.includes('STUDENT')) {
                // Check student profile completeness before redirect
                this.api.getProfile().subscribe({
                  next: (profile: any) => {
                    if (!profile.fullName || !profile.email) {
                      this.router.navigate(['/student-profile']); // incomplete profile: redirect here
                    } else {
                      this.router.navigate(['/dashboard']); // complete profile: normal redirect
                    }
                    this.loading = false;
                  },
                  error: () => {
                    // On error loading profile, force redirect to profile fill form
                    this.router.navigate(['/student-profile']);
                    this.loading = false;
                  }
                });
              } else {
                this.error = 'Unknown role';
                this.loading = false;
              }
            }, 1000); // short delay to show success animation
          },
          error: () => {
            this.error = 'Failed to load user info';
            this.loading = false;
          }
        });
      },
      error: err => {
        if (err.status === 401) {
          this.error = 'Invalid username or password';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Login failed';
        }
        this.loading = false;
      }
    });
  }
}