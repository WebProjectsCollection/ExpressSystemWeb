import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { LOGIN_KEY } from "src/app/public/common.const";
import { HttpService } from "src/app/public/http/http.service";
import { LocalStorageService } from "src/app/public/storage/local-storage.service";

@Component({
  selector: "app-package-order",
  templateUrl: "./package-order.component.html",
  styleUrls: ["./package-order.component.css"],
})
export class PackageOrderComponent implements OnInit {
  validateForm: FormGroup;
  batchNoOptions: Array<{ label: string; value: string }> = [];

  submitForm(): void {
    if (
      this.validateForm.get("orderNumber").value &&
      this.validateForm.controls["id"].value === null
    ) {
      this.msg.error("快递单号不存在，请检查！");
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  resetForm(): void {
    this.validateForm.reset();
  }

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private lgs: LocalStorageService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      orderNumber: [null, [Validators.required]],
      batchNo: [null, [Validators.required]],
      jbbwName: [null, [Validators.required]],
      jbbwPhone: [null, [Validators.required]],
      jbbwAddress: [null, [Validators.required]],
      senderName: [null],
      senderPhone: [null],
      senderAddress: [null],
      weight: [null],
      remarks: [null],
    });
    this.httpService.get("/api/order/batchNos", (res) => {
      if (res.code == 100) {
        this.batchNoOptions = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
  }
  saveOrder(): void {
    this.submitForm();
    if (this.validateForm.valid) {
      let that = this;
      var data = {
        id: this.validateForm.controls["id"].value,
        userName: this.lgs.getObject(LOGIN_KEY).userName,
        orderNumber: this.validateForm.controls["orderNumber"].value,
        batchNo: this.validateForm.controls["batchNo"].value[0],
        jbbwName: this.validateForm.controls["jbbwName"].value,
        jbbwPhone: this.validateForm.controls["jbbwPhone"].value,
        jbbwAddress: this.validateForm.controls["jbbwAddress"].value,
        senderName: this.validateForm.controls["senderName"].value,
        senderPhone: this.validateForm.controls["senderPhone"].value,
        senderAddress: this.validateForm.controls["senderAddress"].value,
        remarks: this.validateForm.controls["remarks"].value,
        weight: this.validateForm.controls["weight"].value,
        status: "1011",
      };
      this.httpService.post("/api/order/update", data, (res) => {
        if (res.code == 100) {
          this.msg.success("保存成功");
          this.resetForm();
        } else {
          this.msg.error(res.msg);
        }
      });
    }
  }
  getOrderDetail(): void {
    let orderNumber = this.validateForm.get("orderNumber").value;
    if (orderNumber === "") {
      return;
    }
    this.httpService.get(
      `/api/order/detail?orderNumber=${orderNumber}`,
      (res) => {
        if (res.code == 100) {
          let isOk = true;
          if (res.data != null) {
            switch (res.data.status) {
              case "1001":
                this.initFormData(res.data);
                break;
              case "1011":
                this.msg.warning("该快递单号已确认揽件！");
                this.initFormData(res.data);
                break;
              default:
                this.msg.error("该快递单号已发货，不可修改，请检查！");
                isOk = false;
                break;
            }
          } else {
            isOk = false;
            this.msg.error("快递单号不存在，请检查！");
          }
          if (!isOk) {
            this.resetForm();
            this.validateForm.get("orderNumber")!.setValue(orderNumber);
          }
        } else {
          this.msg.error(res.msg);
        }
      }
    );
  }
  initFormData(data): void {
    if (data.batchNo === null || data.batchNo === "") {
      data.batchNo = [];
    } else {
      data.batchNo = [data.batchNo];
    }
    this.validateForm.get("id")!.setValue(data.id);
    this.validateForm.get("jbbwName")!.setValue(data.jbbwName);
    this.validateForm.get("jbbwPhone")!.setValue(data.jbbwPhone);
    this.validateForm.get("batchNo")!.setValue(data.batchNo);
    this.validateForm.get("jbbwAddress")!.setValue(data.jbbwAddress);
    this.validateForm.get("senderName")!.setValue(data.senderName);
    this.validateForm.get("senderPhone")!.setValue(data.senderPhone);
    this.validateForm.get("senderAddress")!.setValue(data.senderAddress);
    this.validateForm.get("remarks")!.setValue(data.remarks);
    this.validateForm.get("weight")!.setValue(data.weight);
  }
}
