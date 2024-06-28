import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttentionComponent } from './attention.component';

const routes: Routes = [
  { path: '', component: AttentionComponent },
  { path: 'attention', component: AttentionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttentionRoutingModule { }
