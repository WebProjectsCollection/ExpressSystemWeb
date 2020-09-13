import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniformComponent } from './uniform.component';
import { SettingComponent } from './setting/setting.component';
import { GiveoutComponent } from './giveout/giveout.component';
import { DpGiveoutComponent } from './dp-giveout/dp-giveout.component';
import { SendbackComponent } from './sendback/sendback.component';
import { ManagerStockComponent } from './manager-stock/manager-stock.component';


const routes: Routes = [
  {
    path: '',
    component: UniformComponent,
    children: [
      { path: 'setting', component: SettingComponent },
      { path: 'giveout', component: GiveoutComponent },
      { path: 'dpgiveout', component: DpGiveoutComponent },
      { path: 'sendback', component: SendbackComponent },
      { path: 'adminstock', component: ManagerStockComponent }
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniformRoutingModule { }
