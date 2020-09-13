import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginService } from './login/login.service';
import { AppService } from './app.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'app',
    canActivate: [AppService],
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: 'login',
    canActivate: [LoginService],
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
