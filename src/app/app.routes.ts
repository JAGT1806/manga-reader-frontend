import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { MangaComponent } from './pages/manga/manga.component';
import { ChapterComponent } from './pages/chapter/chapter.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { publicGuard } from './core/guards/public.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent}, 
    {path: 'search', component: SearchComponent},
    {path: 'auth', 
        canActivate: [publicGuard],
        children: [
            {
                path: 'login', component: LoginComponent
            },
            {
                path: 'register', component: RegisterComponent
            },
            {
                path: 'verify-email', component: VerifyEmailComponent
            },
            {
                path: 'reset-password', component: ResetPasswordComponent
            },
            {
                path: '', redirectTo: 'login', pathMatch: 'full'
            }
        ]
    },
    {path: 'manga/:id', component: MangaComponent},
    {path: "chapter/:id", component: ChapterComponent},
    {path: "profile", canActivate:[authGuard], component: ProfileComponent},
    {path: 'favorites', canActivate:[authGuard], component: FavoritesComponent},
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "**", component: NotFoundComponent}
];
