// src/app/_service/api.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private primaryApiUrl = 'http://190.187.182.55:8081/login/auth-backend/public/api';
  private secondaryApiUrl = 'http://192.168.134.28:8081/login/auth-backend/public/api';
  private apiUrl: string = "";

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      const cachedUrl = localStorage.getItem('apiUrl');
      if (cachedUrl) {
        this.apiUrl = cachedUrl;
        console.log(`Using cached API URL: ${this.apiUrl}`);
      }
    } else {
      this.apiUrl = this.primaryApiUrl;
    }
  }

  public initializeApiUrl(): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }

    console.log('Checking primary API URL...');
    return this.checkApiUrlAvailability(this.primaryApiUrl).pipe(
      switchMap(available => available ? of(this.primaryApiUrl) : this.checkApiUrlAvailability(this.secondaryApiUrl).pipe(
        map(innerAvailable => innerAvailable ? this.secondaryApiUrl : this.primaryApiUrl)
      )),
      tap(selectedUrl => {
        this.apiUrl = selectedUrl;
        localStorage.setItem('apiUrl', this.apiUrl);
        console.log(`Using API URL: ${this.apiUrl}`);
      }),
      map(() => undefined)
    );
  }

  private checkApiUrlAvailability(url: string): Observable<boolean> {
    return this.http.get(url, { observe: 'response' }).pipe(
      map(response => response.status === 200),
      catchError(() => of(false))
    );
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
