import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingrediente } from '../models/ingrediente.model';

@Injectable({
  providedIn: 'root'
})
export class IngredienteService {

  private apiUrl = 'http://localhost:3000/api/ingredientes';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Ingrediente> {
    return this.http.get<Ingrediente>(`${this.apiUrl}/${id}`);
  }

  crear(ingrediente: Ingrediente): Observable<any> {
    return this.http.post(this.apiUrl, ingrediente);
  }

  actualizar(id: number, ingrediente: Ingrediente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ingrediente);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
