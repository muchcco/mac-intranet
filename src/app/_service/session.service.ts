import { Injectable, NgZone  } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private timeout: any;
  private readonly timeoutDuration = 120000; // 5000 seconds

  constructor(private router: Router, private ngZone: NgZone) {}

  startSessionTimeout() {
    this.resetTimeout();
    this.setupTimeoutListeners();
  }

  public resetTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.logout(), this.timeoutDuration);
  }

  private logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  private setupTimeoutListeners() {
    document.body.addEventListener('mousemove', () => this.resetTimeout());
    document.body.addEventListener('keydown', () => this.resetTimeout());
  }
}
