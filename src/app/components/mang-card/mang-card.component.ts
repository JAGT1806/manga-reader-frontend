import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Manga } from '../../interfaces/manga.interface';

@Component({
  selector: 'app-mang-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './mang-card.component.html',
  styleUrl: './mang-card.component.css'
})
export class MangCardComponent {
  @Input() manga!: Manga;
}
