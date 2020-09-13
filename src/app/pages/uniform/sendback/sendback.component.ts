import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { ModalService } from 'src/app/public/modal/modal.service';
import { Utils } from 'src/app/public/util/utils';

@Component({
  selector: 'app-sendback',
  templateUrl: './sendback.component.html',
  styleUrls: ['./sendback.component.css']
})
export class SendbackComponent implements OnInit {

  badgeId: string;
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;
  applyRecords: any[] = [];
  backRecords: any[] = [];
  userInfo: any = {};
  isVisible = false;
  reload = true;
  showInfo =false;
  infoMsg='';

  constructor(
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
    private modalService: ModalService) { }

  ngOnInit() {
  }

  getUserInfo() {
    this.userInfo = {};
    if (!this.badgeId || !this.badgeId.trim()) {
      this.msg.warning("请输入员工卡号！");
      return;
    }
    this.badgeId = Utils.clearBadgeId(this.badgeId);
    this.httpService.get('/api/user/info?badgeId=' + this.badgeId, res => {
      if (res.code == 100) {
        this.userInfo = res.data;
        this.badgeId = '';
        this.reload = true;
        this.loadApplyRecords();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  loadApplyRecords() {    
    this.showInfo = false;
    this.httpService.get('/api/user/applyRecords?employeeId=' + this.userInfo.employeeID, res => {
      if (res.code == 100) {
          this.applyRecords = res.data;
          if (this.applyRecords.length == 0) {
            this.infoMsg = '该员工无领取工衣记录！';
            this.showInfo = true;
          } 
          if (this.reload) {
            this.reload = false;
            this.showModal();
          }
        } else {
          this.msg.error(res.msg);
        }
      });
  }

  showModal(): void {
    var tempList = [];
    this.applyRecords.forEach(r => {
      var backNumber = r.number - r.backNumber;
      if (r.status < 3 && r.backNumber < r.number) {
        tempList.push({
          giveoutRecordId: r.id,
          season: r.season,
          style: r.style,
          backNumber: backNumber,
          maxBackNumber: backNumber
        });
      }
    });
    this.backRecords = tempList;
    if (this.backRecords.length == 0 && !this.showInfo) {
      this.infoMsg = '该员工已退还全部工衣！';
      this.showInfo = true;
    }
    this.isVisible = true;
  }


  handleOk(): void {
    var data = this.backRecords;
    console.log(data);
    this.httpService.post('/api/sendback', data, res => {
      if (res.code == 100) {
        this.msg.info('退还成功！');
        this.loadApplyRecords();
        this.isVisible = false;
      } else {
        debugger;
        this.msg.error(res.msg);
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}

