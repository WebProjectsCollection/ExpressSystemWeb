import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { ModalService } from 'src/app/public/modal/modal.service';
import { Utils } from 'src/app/public/util/utils';

@Component({
  selector: 'app-giveout',
  templateUrl: './giveout.component.html',
  styleUrls: ['./giveout.component.css']
})
export class GiveoutComponent implements OnInit {
  badgeId: string;
  data = [];
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;
  uniformTypes: any[] = [];
  uniformSeasons: any[] = [];
  selectSeason: string;
  selectTypes: any[] = [];
  applyNumber: number = 0;
  userInfo: any = {};
  btnEnable: boolean = false;
  applyType: string = '1';//发放类型
  isVisible = false;

  constructor(
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.httpService.get('/api/uniformtype?siteId=' + this.siteId, res => {
      if (res.code == 100) {
        this.uniformTypes = res.data;
        this.getSessions();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  getSessions() {
    this.httpService.get('/api/uniformtype/session?siteId=' + this.siteId, res => {
      if (res.code == 100) {
        res.data.forEach(v => {
          this.uniformSeasons.push({ season: v })
        });
        this.uniformSeasons = [...this.uniformSeasons];
        this.getDefaultSetting();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  getDefaultSetting() {
    this.httpService.get('/api/defaultSetting?siteId=' + this.siteId, res => {
      if (res.code == 100) {
        if (res.data) {
          this.selectSeason = res.data.uniformType;
          this.applyNumber = res.data.applyNumber;
          this.loadUniformInfo();
        }
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  loadUniformInfo() {
    this.selectTypes = [];
    if (this.selectSeason && this.uniformTypes) {
      this.uniformTypes.forEach(v => {
        if (v.season == this.selectSeason) {
          this.selectTypes.push(v);
        }
      })
      this.selectTypes = [...this.selectTypes];
    }
  }

  getUserInfo() {
    this.userInfo = {};
    this.btnEnable = false;
    if (!this.badgeId || !this.badgeId.trim()) {
      this.msg.warning("请输入员工卡号！");
      return;
    }
    this.badgeId = Utils.clearBadgeId(this.badgeId);
    this.httpService.get('/api/user/info?badgeId=' + this.badgeId, res => {
      if (res.code == 100) {
        this.userInfo = res.data;
        this.btnEnable = true;
        this.badgeId = '';
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  giveout(): void {
    var data = {
      siteId: this.siteId,
      fromEmployeeId: -1, // 系统
      toEmployeeId: this.userInfo.employeeID,
      uniforms: this.selectTypes,
      applyType: this.applyType,
      applyNumber: this.applyNumber,
    }
    this.httpService.post('/api/giveout', data, res => {
      if (res.code == 100) {
        this.msg.info('发放成功！');
        this.isVisible = false;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
