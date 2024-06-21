import { Component } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { UserService } from 'src/app/_service/user-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  userName: string = '';
  cargo: string = '';

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userName = localStorage.getItem('name'); // Recupera el nombre de usuario del localStorage
    if (userName) {
      this.userService.getUserByName(userName).subscribe(
        (response) => {
          console.log(response);
          if (response.status === 1) {
            this.userName = response.data.datos_com.NOMBREU;
            this.cargo = response.data.datos_com.CARGO;
            // console.log(this.cargo);
          } else {
            console.error('Error al obtener datos del usuario', response.message);
          }
        },
        (error) => {
          console.error('Error al obtener datos del usuario', error);
        }
      );
    }
  }
}
