import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorResponse } from '../../../models/interfaces/error.interface';
import { Language } from '../../../models/enums/language.enum';
import { LocalizationService } from '../../../core/services/localization.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  selectedLanguage= signal<Language>(Language.ES);
  loginForm : FormGroup;
  isLoading = false;
  errorMessage : string | null = null;
  showPassword = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localizationService: LocalizationService
  ) {
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());

    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern('[A-Za-z0-9._.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$')
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.subscriptions.add(
        this.authService.login(this.loginForm.value).subscribe({
          next: () => {
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            this.errorMessage = error;
            console.error('Error en login:', {
              error: error,
              form: this.loginForm.value
            });
          }
        })
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
