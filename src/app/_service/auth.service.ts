import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://190.187.182.55:8081/login/auth-backend/public/api'; // URL de tu backend

  constructor(private http: HttpClient, private router: Router) { }

  login(name: string, password: string, idPerfil: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { name, password, id_perfil: idPerfil }).pipe(
      tap(response => {
        // Almacenar el token de acceso en localStorage
        localStorage.setItem('access_token', response.data.access_token);
      })
    );
  }

  logout(): Observable<any> {
    // Eliminar el token de acceso del localStorage
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
    return this.http.post<any>(`${this.apiUrl}/logout`, {}); // Llamar al endpoint de logout en el backend
  }

  getProfiles(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-profile/${name}`);
  }

  isAuthenticated(): boolean {
    // Verificar si el usuario está autenticado comprobando la existencia del token en localStorage
    return localStorage.getItem('access_token') !== null;
  }
}
