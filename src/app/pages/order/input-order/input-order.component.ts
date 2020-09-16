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

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
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
      remarks: [null],
    });
  }
  saveOrder(): void {
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
        remarks: this.validateForm.controls["remarks"].value,
      };
      this.httpService.post("/api/order", data, (res) => {
        if (res.code == 100) {
          this.msg.success("设置成功，请重新登录");
        } else {
          this.msg.error(res.msg);
        }
      });
    }
  }
}
