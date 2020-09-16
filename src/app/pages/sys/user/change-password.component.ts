import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { HttpService } from "../../../public/http/http.service";
import { Md5 } from "ts-md5/dist/md5";
import { Router } from "@angular/router";
import { LOGIN_KEY, SITENAME_KEY } from "../../../public/common.const";
import { LocalStorageService } from "src/app/public/storage/local-storage.service";
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  validateForm: FormGroup;
  userName = "";

  submitPasswordForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private router: Router,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private lgs: LocalStorageService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

  savePassword(valid: boolean) {
    if (valid) {
      let that = this;
      var x = {
        userName: this.lgs.getObject(LOGIN_KEY).userName,
        password: Md5.hashStr(this.validateForm.controls["password"].value),
      };
      this.httpService.post("/api/account/setPassword", x, (res) => {
        if (res.code == 100) {
          this.msg.success("设置成功，请重新登录");
          this.lgs.remove(LOGIN_KEY);
          this.lgs.remove(SITENAME_KEY);
          this.httpService.get("/api/account/logout", () => {
            this.router.navigate(["/login"]);
          });
        } else {
          this.msg.error(res.msg);
        }
      });
    }
  }
}
