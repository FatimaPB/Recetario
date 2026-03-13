import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {

  rol: string = '';

  collapsed = false;
  mobileOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.authService.getUsuario().subscribe({
      next: (res: any) => {
        this.rol = res.rol;
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });

  }

  logout() {

    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });

  }

  get isMobile() {
    return window.innerWidth < 1024;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

}