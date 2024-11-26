import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ImageDTO } from '../../models/interfaces/user.interface';
import { UserService } from '../../core/services/user.service';
import { PaginationComponent } from "../pagination/pagination.component";
import { Language } from '../../models/enums/language.enum';
import { LocalizationService } from '../../core/services/localization.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-img-selector',
  standalone: true,
  imports: [CommonModule, PaginationComponent, TranslatePipe],
  templateUrl: './img-selector.component.html',
  styleUrl: './img-selector.component.css'
})
export class ImgSelectorComponent {
  @Output() select = new EventEmitter<ImageDTO>();
  @Output() cancel = new EventEmitter<void>();

  selectedLanguage= signal<Language>(Language.ES);
  images: ImageDTO[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize: number = 12;
  loading = false;
  selectedImage: ImageDTO | null = null;
  currentPageImages: ImageDTO[] = [];

  constructor(private userService: UserService, private localizationService: LocalizationService) {
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());
    this.loadImages();
  }

  ngOnInit() {
    this.loadImages(1);
  }

  private loadImages(page: number = 1) {
    this.loading = true;
    const offset = page - 1;

    this.userService.getImages(offset, this.pageSize).subscribe({
      next: (response) => {
        this.images = response.data;
        this.totalPages = Math.ceil(response.total / this.pageSize);
        this.currentPage = page;
        this.currentPageImages = response.data;
        this.loading = false;
        console.log('Imágenes cargadas:', this.currentPageImages);
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.loading = false;
      }
    });
  }

  selectImage(image: ImageDTO) {
    this.selectedImage = image;
    console.log('Img seleccionada:', this.selectedImage);
  }

  updateCurrentPageImages() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.currentPageImages = this.images.slice(start, end);
  }
  

  onSelect() {
    if (this.selectedImage) {
      this.select.emit(this.selectedImage); // Devuelve la imagen seleccionada al componente padre.
    }
  }
  

  onCancel() {
    this.cancel.emit(); // Informa al componente padre que se canceló la acción.
  }
  
  onPageChange(page: number) {
    if (page >= 1 && page !== this.currentPage) {
      this.loadImages(page);
    }
  }

  onConfirm() {
    if (this.selectedImage) {
      this.select.emit(this.selectedImage);
    }
  }
  
}
