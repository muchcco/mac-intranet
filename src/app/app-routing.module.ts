import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component'; // Ajusta la ruta según sea necesario
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'reports', 
    loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule), 
    canActivate: [AuthGuard] 
  },
  { path: 'logout', redirectTo: '/login', pathMatch: 'full' }, // Ruta para cerrar sesión
  //{ path: '', redirectTo: '/login', pathMatch: 'full' },
  //{ path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
