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
  selector: "app-input-order",
  templateUrl: "./input-order.component.html",
  styles: [],
})
export class InputOrderComponent implements OnInit {
  validateForm: FormGroup;
  batchNoOptions: Array<{ label: string; value: string }> = [];

  submitForm(): void {
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
      orderNumber: [null, [Validators.required]],
      jbbwName: [null, [Validators.required]],
      jbbwPhone: [null, [Validators.required]],
      jbbwAddress: [null, [Validators.required]],
      senderName: [null],
      senderPhone: [null],
      senderAddress: [null],
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
        userName: this.lgs.getObject(LOGIN_KEY).userName,
        orderNumber: this.validateForm.controls["orderNumber"].value,
        jbbwName: this.validateForm.controls["jbbwName"].value,
        jbbwPhone: this.validateForm.controls["jbbwPhone"].value,
        jbbwAddress: this.validateForm.controls["jbbwAddress"].value,
        senderName: this.validateForm.controls["senderName"].value,
        senderPhone: this.validateForm.controls["senderPhone"].value,
        senderAddress: this.validateForm.controls["senderAddress"].value,
      };
      this.httpService.post("/api/order", data, (res) => {
        if (res.code == 100) {
          this.msg.success("保存成功");
          this.validateForm.reset();
        } else {
          this.msg.error(res.msg);
        }
      });
    }
  }
}
