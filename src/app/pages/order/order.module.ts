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
} from "ng-zorro-antd";
import { PackageOrderComponent } from './package-order/package-order.component';
import { JbbwReceiveComponent } from './jbbw-receive/jbbw-receive.component';

@NgModule({
  declarations: [OrderComponent, OrderListComponent, InputOrderComponent, PackageOrderComponent, JbbwReceiveComponent],
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
  ],
})
export class OrderModule {}
