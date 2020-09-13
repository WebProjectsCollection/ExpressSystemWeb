import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { NzModalModule, NzPageHeaderModule, NzAvatarModule, NzTagModule, NzButtonModule, NzIconModule, NzDropDownModule, NzCardModule, NzTableModule, NzGridModule, NzUploadModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    NzModalModule,
    NzPageHeaderModule,
    NzAvatarModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzCardModule,
    NzTableModule,
    NzGridModule,
    NzUploadModule
  ],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
