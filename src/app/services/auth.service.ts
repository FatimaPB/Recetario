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
    return this.http.post(this.apiUrl, data, { withCredentials: true });
  }

  verificarRol() {
    return this.http.get(
      'http://localhost:3000/api/auth/verificar-rol',
      { withCredentials: true }
    );
  }

  verificarSesion() {
    return this.http.get(
      'http://localhost:3000/api/auth/verificar',
      { withCredentials: true }
    );
  }

  getUsuario() {
    return this.http.get(
      'http://localhost:3000/api/auth/me',
      { withCredentials: true }
    );
  }

  logout() {
    return this.http.post(
      'http://localhost:3000/api/auth/logout',
      {},
      { withCredentials: true }
    );
  }
}
