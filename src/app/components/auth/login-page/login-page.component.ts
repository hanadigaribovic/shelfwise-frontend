import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  form: FormGroup;
  showPassword = false;
  wrongPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.wrongPassword = false;
    });
  }

  get passwordInputType() {
    return this.showPassword ? 'text' : 'password';
  }

  onSubmit() {
    if (this.form.valid) {
      const { login, password } = this.form.value;

      this.authService.login({ email: login, password }).subscribe({
        next: () => this.router.navigate(['/books']), // ili gde god ideš posle logina
        error: () => {
          this.wrongPassword = true;
          this.form.get('password')?.setValue('');
          this.form.get('password')?.markAsTouched();
          this.cdr.detectChanges(); // refreshuje template da prikaže poruku
        },
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
