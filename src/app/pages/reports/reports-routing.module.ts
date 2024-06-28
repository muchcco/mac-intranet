import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/modules/layout/layout.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'reports', component: ReportsComponent },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'attention', loadChildren: () => import('./attention/attention.module').then(m => m.AttentionModule) },
      { path: 'status', loadChildren: () => import('./status/status.module').then(m => m.StatusModule) },
      { path: 'multichannel', loadChildren: () => import('./multichannel/multichannel.module').then(m => m.MultichannelModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
