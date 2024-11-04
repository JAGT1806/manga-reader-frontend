import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { AuthComponent } from './pages/auth/auth.component';
import { MangaComponent } from './pages/manga/manga.component';
import { ChapterComponent } from './pages/chapter/chapter.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent}, 
    {path: 'search', component: SearchComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'manga/:id', component: MangaComponent},
    {path: "chapter/:id", component: ChapterComponent},
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "**", component: NotFoundComponent}
];
