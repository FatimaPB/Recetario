import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Componente {
  id_componente?: number;
  id_platillo_padre: number;
  id_platillo_hijo: number;
  cantidad: number;

  platillo_hijo_nombre?: string;
  costo_total?: number;
  costo_en_combo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComponenteService {

  private apiUrl = 'http://localhost:3000/api/componentes';

  constructor(private http: HttpClient) {}

  listarPorPlatillo(id: number): Observable<Componente[]> {
    return this.http.get<Componente[]>(`${this.apiUrl}/platillo/${id}`);
  }

  crear(data: Componente): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
