import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getEstadisticas(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get(this.apiUrl, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }
}