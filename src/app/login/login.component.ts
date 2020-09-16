import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from '../public/http/http.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../public/storage/local-storage.service';
import { LOGIN_KEY } from '../public/common.const';
import { environment } from 'src/environments/environment';
import { Md5 } from "ts-md5/dist/md5";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  validateForm: FormGroup;
  setPasswordVisible = false;
  userName = '';

  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
  }
  submitPasswordForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
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
    private fb: FormBuilder,
    private msg: NzMessageService,
    private httpService: HttpService,
    private lgs: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.showLogin()
    console.log(environment.apiurl);
  }
  showLogin(){    
    this.setPasswordVisible = false;
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
  showSetPassword(){    
    this.setPasswordVisible = true;            
    this.validateForm = this.fb.group({
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

  /**
   * 登录
   */
  login(valid: boolean) {
    if (valid) {
      let that = this;
      var x = {
        userName: this.loginForm.controls['userName'].value,
        password: Md5.hashStr(this.loginForm.controls['password'].value),
      };
      this.httpService.post('/api/account/login', x, res => {
        if (res.code == 100) {
          if(res.data.waitSet === 1){
            this.userName = res.data.userName;
            this.showSetPassword();
          }else{
            that.lgs.setObject(LOGIN_KEY, res.data);
            that.router.navigate(['/app']);
          }
        } else {
          this.msg.error('用户名或密码错误！');
        }
      });
    }
  }
  cancel(){   
    this.showLogin();
  }
  savePassword(valid: boolean){
    if (valid) {
      let that = this;
      var x = {
        userName: this.userName,
        password: Md5.hashStr(this.validateForm.controls['password'].value),
      };
      this.httpService.post('/api/account/setPassword', x, res => {
        if (res.code == 100) {
          this.msg.success('设置成功，请重新登录');
          this.showLogin();
        } else {
          this.msg.error(res.msg);
        }
      });
    }
  }
}
