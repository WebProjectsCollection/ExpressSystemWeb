import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GuangzhouReceiveComponent } from "./guangzhou-receive/guangzhou-receive.component";
import { ImportOrderComponent } from './import-order/import-order.component';
import { InputOrderComponent } from "./input-order/input-order.component";
import { JbbwReceiveComponent } from "./jbbw-receive/jbbw-receive.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderComponent } from "./order.component";
import { PackageOrderComponent } from "./package-order/package-order.component";
import { ZZJCReceiveComponent } from "./zzjc-receive/zzjc-receive.component";
import { QGReceiveComponent } from "./qg-receive/qg-receive.component";

const routes: Routes = [
  {
    path: "",
    component: OrderComponent,
    children: [
      { path: "orderlist", component: OrderListComponent },
      { path: "inputorder", component: InputOrderComponent },
      { path: "packateorder", component: PackageOrderComponent },
      { path: "jbbwreceive", component: JbbwReceiveComponent },
      { path: "gzreceive", component: GuangzhouReceiveComponent },
      { path: "importorder", component: ImportOrderComponent },
      { path: "zzjcreceive", component: ZZJCReceiveComponent },
      { path: "qgreceive", component: QGReceiveComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
