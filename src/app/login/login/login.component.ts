import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../_service/api.service';
import { AuthService } from '../../_service/auth.service';
import { Profile } from '../../_models/profile.model';
import { UserService } from '../../_service/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('connectionModal', { static: true }) connectionModal!: TemplateRef<any>;
  modalRef!: BsModalRef;
  
  user: any;
  showProfileSelect: boolean = false;
  selectedProfileId: string | null = null;

  name: string = '';
  password: string = '';
  errorMessage: string = '';
  profiles: Profile[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadProfiles();
    this.openModal();
    this.apiService.initializeApiUrl().subscribe(
      () => {
        this.modalRef.hide();
        this.spinner.hide();
      },
      (error: any) => {
        this.modalRef.hide();
        this.spinner.hide();
        alert('Error al validar las URLs de la API');
      }
    );

    // Establecer la imagen de fondo aleatoria
    const randomImageUrl = 'assets/img/auth/' + this.getRandomImage();
    // document.body.style.backgroundImage = 'url(' + randomImageUrl + ')';
    document.documentElement.style.setProperty('--random-image', 'url(' + randomImageUrl + ')');
  }

  openModal() {
    this.modalRef = this.modalService.show(this.connectionModal);
    this.spinner.show();
  }

  login(): void {
    if (!this.selectedProfileId) {
      this.errorMessage = 'Seleccione un perfil antes de continuar.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.name, this.password, this.selectedProfileId).subscribe(
      response => {
        this.isLoading = false;
        if (response.status) {
          localStorage.setItem('access_token', response.data.access_token);
          if(this.selectedProfileId == '2'){
            this.router.navigate(['/reports']);
          }
        } else {
          this.errorMessage = response.message;
        }
      },
      error => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Error inesperado en el inicio de sesión.';
      }
    );
  }

  logout(): void {
    this.authService.logout().subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        this.router.navigate(['/login']);
      }
    );
  }

  loadProfiles(): void {
    if (this.name) {
      this.authService.getProfiles(this.name).subscribe(
        response => {
          this.profiles = response.data.profiles;
          this.showProfileSelect = true;
          this.errorMessage = '';
        },
        error => {
          this.errorMessage = error.error.message;
          this.showProfileSelect = false;
          console.log(this.errorMessage)
        }
      );
    }
  }

  getRandomImage(): string {
    const images = [
      'anden.jpg',
      'arequipa.jpg',
      'lima-barranco.jpg',
      // Agrega aquí el nombre de todas tus imágenes en la carpeta assets/img/auth
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  onNameChange(): void {
    this.errorMessage = '';
    this.profiles = [];
    this.selectedProfileId = null;
    this.loadProfiles();
  }
}
