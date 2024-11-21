import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangePasswordRequest } from '../../models/interfaces/user.interface';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<ChangePasswordRequest>();

  passwordForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  get f() { return this.passwordForm.controls; }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Obtener el ID del usuario actual
    const currentUser = this.authService.getCurrentUserValue();
    if (!currentUser?.user?.idUser) {
      this.errorMessage = 'Usuario no encontrado';
      this.loading = false;
      return;
    }

    const request: ChangePasswordRequest = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.updatePassword(currentUser.user.idUser, request)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.close.emit();
          // Aquí puedes agregar un mensaje de éxito si lo deseas
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al cambiar la contraseña';
          this.loading = false;
        }
      });
  }

  onCancel() {
    this.close.emit();
  }
}
