import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ErrorResponse } from '../../../models/interfaces/error.interface';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  verifyForm: FormGroup;
  isLoading = false;
  isResending = false;
  showPassword = false;

  errorEmail: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$')
      ]]
    });

  }

  ngOnInit(): void {
    // Check for email in query params
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.verifyForm.patchValue({ email: params['email'] });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.code?.valid) {
      this.isLoading = true;
      this.errorEmail = null;
      this.errorMessage = null;
      console.log(this.code?.value);

      this.subscription.add(
        this.authService.verifyEmail({code: this.code?.value}).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/auth/login'])
          },
          error: (error: any) => {
            this.isLoading = false;
            this.errorMessage = error;
          }
        })
      );
    }
  }

  sendCode(): void {
    if (this.email?.valid) {
      this.isResending = true;
      this.errorEmail = null;
      this.errorMessage = null;

      this.successMessage = null;
      
      this.subscription.add(
        this.authService.resendVerification({ email: this.email.value }).subscribe({
          next: () => {
            this.isResending = false;
            this.successMessage = 'Código de validación enviado al correo';
          },
          error: (error: any) => {
            this.isResending = false;
            this.errorEmail = error;
          }
        })
      );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  get code() { return this.verifyForm.get('code'); }
  get email() { return this.verifyForm.get('email'); }
}
