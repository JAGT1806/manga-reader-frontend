import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Manga } from '../../models/interfaces/manga.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../core/services/localization.service';
import { Language } from '../../models/enums/language.enum';

@Component({
  selector: 'app-mang-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    TranslatePipe
  ],
  templateUrl: './mang-card.component.html',
  styleUrl: './mang-card.component.css'
})
export class MangCardComponent {
  @Input() manga!: Manga;
  selectedLanguage= signal<Language>(Language.ES);

  constructor(private localizationService: LocalizationService) { 
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());
  }
}
