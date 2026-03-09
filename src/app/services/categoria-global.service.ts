import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGlobalService {

  private apiUrl = 'http://localhost:3000/api/categorias-globales';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtener(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crear(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  actualizar(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
