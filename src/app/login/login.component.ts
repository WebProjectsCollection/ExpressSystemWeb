import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from '../public/http/http.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../public/storage/local-storage.service';
import { LOGIN_KEY, SITENAME_KEY } from '../public/common.const';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  siteList: any[] = [];
  siteName: string;

  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private httpService: HttpService,
    private lgs: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      site: [null, [Validators.required]],
      remember: [true]
    });
    this.getSiteList();
    console.log(environment.apiurl);
  }

  /**
   * 登录
   */
  login(valid: boolean) {
    if (valid) {
      let that = this;
      var x = {
        userName: this.loginForm.controls['userName'].value,
        password: this.loginForm.controls['password'].value,
        siteId: this.loginForm.controls['site'].value,
      }
      this.httpService.post('/api/account/login', x, res => {
        if (res.code == 100) {
          that.lgs.setObject(LOGIN_KEY, res.data);
          that.lgs.set(SITENAME_KEY, that.siteName);
          that.router.navigate(['/app']);
        } else {
          this.msg.error('用户名或密码错误！');
        }
      });
    }
  }

  getSiteList(): void {
    this.httpService.get('/api/site', res => {
      if (res.code == 100) {
        this.siteList = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  changeSite(s_siteId): void {
    this.siteList.forEach(element => {
      if (s_siteId === element.siteID) {
        this.siteName = element.siteName;
      }
    });
  }
}
