import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { LOGIN_KEY } from 'src/app/public/common.const';

@Component({
  selector: 'app-setting-default',
  templateUrl: './setting-default.component.html',
  styleUrls: ['./setting-default.component.css']
})
export class SettingDefaultComponent implements OnInit {

  uniformTypes: any[] = [];
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;

  defaultType: string;
  defaultTypeOK: boolean = true;
  defaultNumber: number = 0;
  defaultEmails: string[];
  defaultEmailOK: boolean = true;
  emailTip: string = '请在输入邮箱后，单击回车键'

  constructor(
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService
  ) { }

  ngOnInit() {
    this.loadUniformTypes();
    this.initData();
  }

  loadUniformTypes() {
    this.httpService.get('/api/uniformtype/session?siteId=' + this.siteId, res => {
      if (res.code == 100 && res.data) {
        res.data.forEach(v => {
          this.uniformTypes.push({ season: v })
        });
        this.uniformTypes = [...this.uniformTypes];
      } else {
        this.msg.error(res.msg);
      }
    });
  }
  initData() {
    this.httpService.get('/api/defaultSetting?siteId=' + this.siteId, res => {
      if (res.code == 100) {
        if (res.data) {
          this.defaultType = res.data.uniformType;
          this.defaultNumber = res.data.applyNumber;
          this.defaultEmails = res.data.hrEmails.split(',');
        }
      } else {
        this.msg.error(res.msg);
      }
    });
  }
  saveDefaultData() {
    if (this.verifyData()) {
      var data = {
        siteId: this.siteId,
        uniformType: this.defaultType,
        hrEmails: this.defaultEmails.toString(),
        applyNumber: this.defaultNumber
      }
      this.httpService.post('/api/defaultSetting', data, res => {
        if (res.code == 100) {
          this.msg.info('保存成功！');
        } else {
          this.msg.error(res.msg);
        }
      });
    }
  }
  verifyData(): boolean {
    this.defaultTypeOK = true;
    this.defaultEmailOK = true;
    if (!this.defaultType) {
      this.defaultTypeOK = false;
    }
    if (!this.defaultEmails || this.defaultEmails.length == 0) {
      this.defaultEmailOK = false;
    }
    return this.defaultTypeOK && this.defaultEmailOK;
  }
  modelChange() {
    this.defaultEmailOK = true;
    let reg: RegExp = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    var lastIndex = this.defaultEmails.length - 1;
    let result: boolean = reg.test(this.defaultEmails[lastIndex]);
    if (!result) {
      this.defaultEmails.splice(lastIndex, 1);
      this.defaultEmailOK = false;
    }
  }
}
