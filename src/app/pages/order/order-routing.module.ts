import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InputOrderComponent } from "./input-order/input-order.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderComponent } from "./order.component";

const routes: Routes = [
  {
    path: "",
    component: OrderComponent,
    children: [
      { path: "orderlist", component: OrderListComponent },
      { path: "inputorder", component: InputOrderComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
