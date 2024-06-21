import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/modules/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'attention', loadChildren: () => import('./attention/attention.module').then(m => m.AttentionModule) },
      { path: 'status', loadChildren: () => import('./status/status.module').then(m => m.StatusModule) },
      // { path: 'report-all', loadChildren: () => import('./report-all/report-all.module').then(m => m.ReportAllModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
