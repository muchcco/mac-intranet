import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttentionService {

  private apiUrl = 'http://190.187.182.55:8081/login/auth-backend/public/api';

  constructor(private http: HttpClient) { }

  getAttentionData(fecha_inicio: string, fecha_fin: string, nom_mac: string, servicio: number): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    let params = {
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      nom_mac: nom_mac,
      servicio: servicio.toString()
    };

    return this.http.get<any>(`${this.apiUrl}/table-attention`, { params, headers });
  }

  getFormDetails(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<any>(`${this.apiUrl}/form-details`, { headers });
  }
}
