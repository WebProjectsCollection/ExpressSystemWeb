import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', loadChildren: () => import('../pages/welcome/welcome.module').then(m => m.WelcomeModule) },
      { path: 'welcome', loadChildren: () => import('../pages/welcome/welcome.module').then(m => m.WelcomeModule) },
      { path: 'sys', loadChildren: () => import('../pages/sys/sys.module').then(m => m.SysModule) },
      { path: 'uniform', loadChildren: () => import('../pages/uniform/uniform.module').then(m => m.UniformModule) },
      { path: 'report', loadChildren: () => import('../pages/report/report.module').then(m => m.ReportModule) },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
