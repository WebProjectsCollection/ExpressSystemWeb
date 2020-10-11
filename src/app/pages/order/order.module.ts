import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OrderRoutingModule } from "./order-routing.module";
import { OrderComponent } from "./order.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { InputOrderComponent } from "./input-order/input-order.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NzTableModule,
  NzGridModule,
  NzFormModule,
  NzInputModule,
  NzButtonModule,
  NzSelectModule,
  NzIconModule,
  NzDividerModule,
  NzModalModule,
  NzTreeModule,
  NzCheckboxModule,
  NzTimePickerModule,
  NzDatePickerModule,
  NzUploadModule,
} from "ng-zorro-antd";
import { PackageOrderComponent } from './package-order/package-order.component';
import { JbbwReceiveComponent } from './jbbw-receive/jbbw-receive.component';
import { GuangzhouReceiveComponent } from './guangzhou-receive/guangzhou-receive.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ImportOrderComponent } from './import-order/import-order.component';
import { ZZJCReceiveComponent } from "./zzjc-receive/zzjc-receive.component";
import { QGReceiveComponent } from "./qg-receive/qg-receive.component";
import { UpdateByBatchNoComponent } from './components/update-by-batch-no/update-by-batch-no.component';

@NgModule({
  declarations: [OrderComponent, OrderListComponent, InputOrderComponent, PackageOrderComponent,
    JbbwReceiveComponent, GuangzhouReceiveComponent, OrderDetailComponent, ZZJCReceiveComponent, QGReceiveComponent, ImportOrderComponent, UpdateByBatchNoComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    NzTreeModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzUploadModule,
  ],
})
export class OrderModule {}
