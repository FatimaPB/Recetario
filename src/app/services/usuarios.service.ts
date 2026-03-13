import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  crear(data: {
    nombre: string;
    email: string;
    password: string;
    rol: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      withCredentials: true
    });
  }

  cambiarEstado(id: number, estado: 'activo' | 'inactivo'): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/estado`,
      { estado },
      { withCredentials: true }
    );
  }
}