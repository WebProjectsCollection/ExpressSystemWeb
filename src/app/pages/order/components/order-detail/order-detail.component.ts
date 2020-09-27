import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { HttpService } from "src/app/public/http/http.service";

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.component.html",
  styleUrls: ["./order-detail.component.css"],
})
export class OrderDetailComponent implements OnInit {
  detailVisible: boolean = true;
  orderinfo: any = {};
  @Input() ordernumber: string = "";
  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.get(
      `/api/order/detail?orderNumber=${this.ordernumber}`,
      (res) => {
        this.orderinfo = res.data;
      }
    );
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}
