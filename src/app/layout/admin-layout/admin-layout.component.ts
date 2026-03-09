import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {


  constructor(private router: Router, private authService: AuthService) { }


  rol: string = '';

  ngOnInit() {
    this.rol = this.authService.getRol();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  collapsed = false;
  mobileOpen = false;

  get isMobile() {
    return window.innerWidth < 1024;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

}

