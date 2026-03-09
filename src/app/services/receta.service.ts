import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {

  private apiUrl = 'http://localhost:3000/api/recetas';

  constructor(private http: HttpClient) { }

  listarPorPlatillo(id: number) {
    return this.http.get<Receta[]>(`${this.apiUrl}/platillo/${id}`);
  }

  crear(data: Receta) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  actualizar(id: number, data: Receta): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
