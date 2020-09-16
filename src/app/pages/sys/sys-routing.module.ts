import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { PermissionComponent } from './permission/permission.component';
import { SysComponent } from './sys.component';
import { ChangePasswordComponent } from './user/change-password.component';


const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'user', component: UserComponent },
      { path: 'role', component: RoleComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'permission', component: PermissionComponent },
      { path: 'changePassword', component: ChangePasswordComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
