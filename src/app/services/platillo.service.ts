import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platillo } from '../models/platillo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatilloService {

  private apiUrl = 'http://localhost:3000/api/platillos';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Platillo[]> {
    return this.http.get<Platillo[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Platillo> {
    return this.http.get<Platillo>(`${this.apiUrl}/${id}`);
  }

  crear(data: FormData) {
    return this.http.post(this.apiUrl, data);
  }

  actualizar(id: number, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }


  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  obtenerSubcategorias() {
    return this.http.get<any[]>('http://localhost:3000/api/subcategorias');
  }


  obtenerReportePlatillo(id: number) {
    return this.http.get<any>(`${this.apiUrl}/reportes/${id}`);
  }

  obtenerRecetarioCompleto() {
    return this.http.get<any[]>(`${this.apiUrl}/recetario-completo`);
  }


}
