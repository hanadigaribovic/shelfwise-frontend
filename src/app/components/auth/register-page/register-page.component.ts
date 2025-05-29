import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  form: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordsMatchValidator }
    );
  }

  get passwordInputType() {
    return this.showPassword ? 'text' : 'password';
  }

  get confirmPasswordInputType() {
    return this.showConfirmPassword ? 'text' : 'password';
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;

      this.authService.register({ email, password }).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err) => console.error('Registration error:', err),
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

export function passwordsMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
}
