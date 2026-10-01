import { Component, HostListener, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-sidebar',
  imports: [...SHARED_IMPORTS],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true,
})
export class SidebarComponent implements OnInit{
  mobileOpen: boolean = false;
  isMobileView: boolean = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.isMobileView = window.innerWidth < 900;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobileView = window.innerWidth < 900;

    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar(): void {
    this.mobileOpen = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      error: () => {
        this.authService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isTeacher(): boolean {
    return this.authService.isTeacher();
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }

  canSeeAdminItems(): boolean {
    return this.authService.canSeeAdminItems();
  }

  canSeeTeacherItems(): boolean {
    return this.authService.canSeeTeacherItems();
  }

  canSeeStudentItems(): boolean {
    return this.authService.canSeeStudentItems();
  }

  canSeeHomeItem(): boolean {
    return this.authService.canSeeHomeItem();
  }

  canSeeRegisterItem(): boolean {
    return this.authService.canSeeRegisterItem();
  }

}
