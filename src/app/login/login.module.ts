import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NzFormModule, NzInputModule, NzNotificationModule, NzSpinModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    LoginRoutingModule,
    NzFormModule,
    NzInputModule,
    NzNotificationModule,
    NzSpinModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
