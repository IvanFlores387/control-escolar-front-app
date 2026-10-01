import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.scss',
})
export class NavbarUser implements OnInit {
  public expandedMenu: string | null = null;
  public userInitial = '';
  public isMobileView = false;
  public showUserMenu = false;
  public mobileOpen = false;

  paletteMode: 'light' | 'dark' = 'light';

  colorPalettes = {
    light: {
      '--background-main': '#f4f7fb',
      '--sidebar-bg': '#23395d',
      '--navbar-bg': '#fff',
      '--text-main': '#222',
      '--table-bg': '#fff',
      '--table-header-bg': '#cfe2ff',
    },
    dark: {
      '--background-main': '#181a1b',
      '--sidebar-bg': '#1a2636',
      '--navbar-bg': '#222',
      '--text-main': '#e4ecfa',
      '--table-bg': '#222',
      '--table-header-bg': '#30507a',
    }
  };

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  constructor() {
    const name = this.authService.getUserCompleteName();
    this.userInitial = name?.trim()?.[0]?.toUpperCase() || '?';
  }

  ngOnInit(): void {
    this.isMobileView = window.innerWidth <= 992;

    // Recuperar preferencia guardada o usar light por defecto
    const savedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark';
    this.paletteMode = savedTheme || 'light';
    this.applyPalette(this.paletteMode);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobileView = window.innerWidth <= 992;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  togglePalette(): void {
    this.paletteMode = this.paletteMode === 'light' ? 'dark' : 'light';

    // Guardar en localStorage para que persista al iniciar sesión o recargar
    localStorage.setItem('theme-preference', this.paletteMode);
    this.applyPalette(this.paletteMode);
  }

  private applyPalette(mode: 'light' | 'dark'): void {
    const palette = this.colorPalettes[mode];
    Object.keys(palette).forEach((key) => {
      document.documentElement.style.setProperty(
        key,
        palette[key as keyof typeof palette]
      );
    });
    // Opcional: actualiza el atributo para selectores CSS [data-theme="dark"]
    document.documentElement.setAttribute('data-theme', mode);
  }

  toggleSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar(): void {
    this.mobileOpen = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  editUser(): void {
    const userId = this.authService.getUserId();
    const userRole = this.authService.getUserGroup();
    this.router.navigate(['/registro-usuarios', userRole, userId]);
    this.showUserMenu = false;
  }

  toggleMenu(menu: string): void {
    this.expandedMenu = this.expandedMenu === menu ? null : menu;
  }

  closeMenu(): void {
    this.expandedMenu = null;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.destroyUser();
        this.router.navigate(['/inicio']);
        this.closeSidebar();
      },
      error: () => {
        this.authService.destroyUser();
        this.router.navigate(['/inicio']);
        this.closeSidebar();
      }
    });
  }

  isAdmin(): boolean { return this.authService.isAdmin(); }
  isTeacher(): boolean { return this.authService.isTeacher(); }
  isStudent(): boolean { return this.authService.isStudent(); }
  canSeeAdminItems(): boolean { return this.authService.canSeeAdminItems(); }
  canSeeTeacherItems(): boolean { return this.authService.canSeeTeacherItems(); }
  canSeeStudentItems(): boolean { return this.authService.canSeeStudentItems(); }
  canSeeHomeItem(): boolean { return this.authService.canSeeHomeItem(); }
  canSeeRegisterItem(): boolean { return this.authService.canSeeRegisterItem(); }
}
