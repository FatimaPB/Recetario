import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth/login';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  guardarSesion(respuesta: any) {
    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }


  getUsuario() {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  getRol(): string {
    const usuario = this.getUsuario();
    return usuario?.rol || '';
  }
}
