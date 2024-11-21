import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorResponse } from '../../../models/interfaces/error.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$')
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$')
      ]]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.subscription.add(
        this.authService.register(this.registerForm.value).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/auth/verify-email'], { 
              queryParams: { email: this.email?.value } 
            });
          },
          error: (error: any) => {
            this.isLoading = false;
            this.errorMessage = error;
            console.error('Error registering error:', error);
            console.error('Error registering:', this.errorMessage);
          }
        })
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() { return this.registerForm.get('email'); }
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }

  getPasswordRequirements(): string[] {
    const requirements = [];
    const password = this.password?.value || '';

    if (password.length < 6) requirements.push('At least 6 characters');
    //if (!/[A-Z]/.test(password)) requirements.push('One uppercase letter');
    //if (!/[a-z]/.test(password)) requirements.push('One lowercase letter');
    //if (!/\d/.test(password)) requirements.push('One number');

    return requirements;
  }

}
