import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Unidad {
  id_unidad: number;
  nombre: string;
  tipo: string;
  factor_base: number;
}

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  private apiUrl = 'http://localhost:3000/api/unidades';

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(this.apiUrl);
  }
}
