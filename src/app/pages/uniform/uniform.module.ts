import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniformComponent } from './uniform.component';
import { UniformRoutingModule } from './uniform-routing.module';
import { SettingComponent } from './setting/setting.component';
import { NzTabsModule, NzTableModule, NzInputModule, NzButtonModule, NzInputDirective, NzGridModule, NzFormModule, NzSelectModule, NzIconModule, NzDividerModule, NzModalModule, NzTreeModule, NzCheckboxModule, NzPopconfirmModule, NzInputNumberModule, NzAlertModule, NzToolTipModule, NzCollapseModule, NzTagModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingTypeComponent } from './setting-type/setting-type.component';
import { SettingDefaultComponent } from './setting-default/setting-default.component';
import { GiveoutComponent } from './giveout/giveout.component';
import { DpGiveoutComponent } from './dp-giveout/dp-giveout.component';
import { SendbackComponent } from './sendback/sendback.component';
import { ManagerStockComponent } from './manager-stock/manager-stock.component';


@NgModule({
  declarations: [UniformComponent, SettingComponent, SettingTypeComponent, SettingDefaultComponent, GiveoutComponent, DpGiveoutComponent, SendbackComponent, ManagerStockComponent],
  imports: [
    CommonModule,
    UniformRoutingModule,
    NzTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzPopconfirmModule,
    NzInputNumberModule,
    NzGridModule,
    NzSelectModule,
    NzFormModule,
    NzDividerModule,
    NzAlertModule,
    NzToolTipModule,
    NzCollapseModule,
    NzModalModule,
    NzTagModule,
  ]
})
export class UniformModule { }
