import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultichannelRoutingModule } from './multichannel-routing.module';
import { MultichannelComponent } from './multichannel.component';


@NgModule({
  declarations: [
    MultichannelComponent
  ],
  imports: [
    CommonModule,
    MultichannelRoutingModule
  ]
})
export class MultichannelModule { }
