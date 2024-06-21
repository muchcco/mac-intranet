import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../modules/header/header.component';
import { SidebarComponent } from '../modules/sidebar/sidebar.component';
import { LayoutComponent } from '../modules/layout/layout.component';
import { FooterComponent } from '../modules/footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    FooterComponent
  ]
})
export class SharedModule { }
