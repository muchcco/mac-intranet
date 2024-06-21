import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://190.187.182.55:8081/login/auth-backend/public/api'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener los perfiles asociados al nombre de usuario
  getUserByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-profile/${name}`);
  }
}
