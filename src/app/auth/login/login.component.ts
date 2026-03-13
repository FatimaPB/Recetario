import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  iniciarSesion() {

    this.error = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: () => {
        // La cookie se guarda automáticamente en el navegador
        this.router.navigate(['/dashboard']);
      },

      error: () => {
        this.error = 'Correo o contraseña incorrectos';
      }

    });

  }

}