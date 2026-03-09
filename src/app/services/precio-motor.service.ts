import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecioMotorService {

  private apiUrl = 'http://localhost:3000/api/recalcular-precio';

  constructor(private http: HttpClient) {}

  recalcular(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, {});
  }

}
