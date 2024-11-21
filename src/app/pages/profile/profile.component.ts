import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDTO } from '../../models/interfaces/auth.interface';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ChangePasswordRequest, ImageDTO, UpdateUserRequest } from '../../models/interfaces/user.interface';
import { ImgSelectorComponent } from "../../components/img-selector/img-selector.component";
import { ChangePasswordModalComponent } from "../../components/change-password-modal/change-password-modal.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImgSelectorComponent, ChangePasswordModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  user: UserDTO | null = null;
  submitted = false;
  loading = false;
  showImageSelector = false;
  showPasswordModal = false;
  currentImageUrl: string | null = null;
  selectedImageId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    const userProfile = this.authService.getUserProfile();
    if (!userProfile) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userService.getUser(userProfile!.idUser).subscribe({
      next: (response) => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });

    this.user = userProfile;
    this.currentImageUrl = userProfile.imageProfile;
    
    this.profileForm.patchValue({
      username: userProfile.username,
      email: userProfile.email
    });
  }

  onImageSelected(image: ImageDTO) {
    this.currentImageUrl = image.url;
    this.selectedImageId = image.id;
    this.showImageSelector = false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    console.log("ImagenId seleccionada: ", this.selectedImageId);
    const updateData: UpdateUserRequest = {
      ...this.profileForm.value,
      profileImage: this.selectedImageId
    };

    this.userService.updateUser(this.user!.idUser, updateData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log("Usuario actualizado:", updateData);
        // La actualización del estado local se maneja en el servicio
        // Mostrar mensaje de éxito
      },
      error: (error) => {
        this.loading = false;
        console.log("Error al actualizar el usuario: " + error);
        // Mostrar mensaje de error
      }
    });
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onPasswordChange(passwordData: ChangePasswordRequest) {
    if (!this.user) return;
    
    this.userService.updatePassword(this.user.idUser, passwordData).subscribe({
      next: () => {
        this.showPasswordModal = false;
        // Mostrar mensaje de éxito
      },
      error: (error) => {
        // Mostrar mensaje de error
      }
    });
  }

}
