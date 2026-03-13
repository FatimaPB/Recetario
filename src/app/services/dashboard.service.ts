import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) { }

  getEstadisticas(): Observable<any> {
    return this.http.get(this.apiUrl, {
      withCredentials: true
    });
  }

}