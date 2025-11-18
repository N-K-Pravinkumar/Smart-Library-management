import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class Login {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  login() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;

        localStorage.setItem('token', res.token || '');
        localStorage.setItem('username', res.username || '');

        const role = res.role?.toLowerCase() || '';
        localStorage.setItem('role', role);

        if (role === 'student' && res.id != null) {
          localStorage.setItem('userId', res.id.toString());
          this.router.navigateByUrl('/student/home');
        } else if (role === 'librarian') {
          this.router.navigateByUrl('/librarian/home');
        } else {
          alert('Unknown user role received from server');
        }
      },

      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.status === 401
            ? 'Invalid email or password'
            : 'Server error. Please try again later.';
      },
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
