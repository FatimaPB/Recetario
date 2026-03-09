import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfiguracionPrecios } from '../models/configuracion-precios.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionPreciosService {

  private apiUrl = 'http://localhost:3000/api/configuracion-precios';

  constructor(private http: HttpClient) {}

  obtener(): Observable<ConfiguracionPrecios> {
    return this.http.get<ConfiguracionPrecios>(this.apiUrl);
  }

  guardar(data: ConfiguracionPrecios): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

}
