import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDTO } from '../../models/interfaces/auth.interface';
import { AdminService } from '../../core/services/admin.service';
import { UserService } from '../../core/services/user.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Language } from '../../models/enums/language.enum';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{
  selectedLanguage= signal<Language>(Language.ES);
  users: UserDTO[] = [];
  total: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  isDeleting: boolean = false;
  private destroy$ = new Subject<void>();
  private filterChange$ = new Subject<void>();

  filters = {
    username: '',
    email: '',
    role: '',
    enabled: null as boolean | null
  };

  constructor(
    private userListService: AdminService,
    private userService: UserService,
    private localizationService: LocalizationService
  ) {
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());
  }

  ngOnInit(): void {
    this.setupFilterChangeSubscription();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilterChangeSubscription(): void {
    this.filterChange$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadUsers();
      });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  loadUsers(): void {
    const offset = (this.currentPage - 1) * this.limit;
    
    this.userListService.getUsers({
      ...this.filters,
      offset,
      limit: this.limit
    }).subscribe(response => {
      console.log(response);
      this.users = response.data;
      this.total = response.total;
    });
  }

  onFiltersChange(): void {
    this.filterChange$.next();
  }

  onPageChange(page: number): void {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  isUserEnabled(user: UserDTO): boolean {
    // Implementar lógica según tu modelo de datos
    return user.enabled ?? false;// Por defecto
  }

  onEditUser(user: UserDTO): void {
    
  }

  onDeleteUser(user: UserDTO): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.username}?`)) {
      this.isDeleting = true;
      this.userService.deleteUser(user.idUser).subscribe({
        next: () => {
          this.loadUsers();
          this.isDeleting = false;
        },
        error: () => {
          this.isDeleting = false;
        }
      });
    }
  }
}
