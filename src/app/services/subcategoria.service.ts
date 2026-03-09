import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subcategoria } from '../models/subcategoria.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  private apiUrl = 'http://localhost:3000/api/subcategorias';

  constructor(private http: HttpClient) { }

  listar(): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Subcategoria> {
    return this.http.get<Subcategoria>(`${this.apiUrl}/${id}`);
  }

  crear(data: Subcategoria): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizar(id: number, data: Subcategoria): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
