import { Component, OnInit } from '@angular/core';
import { ListMangasResponse, Manga } from '../../interfaces/manga.interface';
import { MangaService } from '../../services/manga.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  mangas: Manga[] = [];

  constructor(private mangaService: MangaService) {}

  ngOnInit(): void {
    this.mangaService.getAllMangas().subscribe(response => {
      this.mangas = response.data;
    });
  }
}
