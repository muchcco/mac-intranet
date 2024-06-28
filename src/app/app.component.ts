import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './_service/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private sessionservice: SessionService, private router: Router){}

  ngOnInit() {
    
    console.log("conexion ba");  // Este mensaje debería aparecer en la consola
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Start the session timeout service
      this.sessionservice.startSessionTimeout();
    } else {
      // Redirect to login if not logged in
      this.router.navigate(['/login']);
    }
  }

  @HostListener('window:mousemove') onMouseMove() {
    this.sessionservice.resetTimeout();
  }

  @HostListener('window:keypress') onKeyPress() {
    this.sessionservice.resetTimeout();
  }
}
