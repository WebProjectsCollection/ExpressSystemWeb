import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { SysComponent } from './sys.component';
import { SysRoutingModule } from './sys-routing.module';
import { NzTableModule, NzGridModule, NzFormModule, NzInputModule, NzButtonModule, NzSelectModule, NzIconModule, NzDividerModule, NzModalModule, NzTreeModule, NzCheckboxModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './user/change-password.component';



@NgModule({
  declarations: [UserComponent, PermissionComponent, RoleComponent, MenuComponent, SysComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SysRoutingModule,
    NzTableModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,
    NzDividerModule ,
    NzModalModule ,
    NzTreeModule ,
    NzCheckboxModule ,
  ]
})
export class SysModule { }
