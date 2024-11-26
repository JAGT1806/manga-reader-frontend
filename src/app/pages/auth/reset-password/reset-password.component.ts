import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Language } from '../../../models/enums/language.enum';
import { LocalizationService } from '../../../core/services/localization.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  selectedLanguage= signal<Language>(Language.ES);
  resetForm: FormGroup;
  isLoading = false;
  isRequestingCode = false;
  
  showPassword = false;

  errorEmail: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;


  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localizationService: LocalizationService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());
    this.resetForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$')
      ]],
      code: ['', [Validators.required, Validators.minLength(7)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    }); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  sendCode(): void {
    if (this.email?.valid) {
      this.isRequestingCode = true;
      this.errorEmail = null;
      this.errorMessage = null;
      this.successMessage = null;

      this.subscription.add(
        this.authService.forgotPassword({ email: this.email.value }).subscribe({
          next: () => {
            this.isRequestingCode = false;
            this.translate.get('SEND.EMAIL.CODE').subscribe((text: string) => this.successMessage = text);
          },
          error: (error: any) => {
            this.isRequestingCode = false;
            this.errorEmail = error;
          }
        })
      );
    }
  }

  onSubmit(): void {
    if (this.code?.valid && this.password?.valid) {
      this.isLoading = true;
      this.errorEmail = null;
      this.errorMessage = null;
      this.successMessage = null;

      this.subscription.add(
        this.authService.resetPassword({code: this.code?.value, password: this.password?.value}).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate([ '/', this.selectedLanguage(), 'auth', 'login']);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.errorMessage = error;
          }
        })
      );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() { return this.resetForm.get('email'); }
  get code() { return this.resetForm.get('code'); }
  get password() { return this.resetForm.get('newPassword'); }
}