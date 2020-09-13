import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { Utils } from 'src/app/public/util/utils';

@Component({
  selector: 'app-apply-record',
  templateUrl: './apply-record.component.html',
  styleUrls: ['./apply-record.component.css']
})
export class ApplyRecordComponent implements OnInit {
  validateForm: FormGroup;
  recordList: any[] = [];
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;

  pageIndex = 1;
  pageSize = 10;
  total = 1;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      giveoutTime: [[]],
      sendbackTime: [[]],
      employeeId: [''],
    });
    this.searchData();
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.total = 0;
    this.recordList = [];
    this.httpService.get('/api/giveout/record?' + this.getParams(), res => {
      if (res.code == 100) {
        this.total = res.data.total;
        this.recordList = res.data.list;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  export() {
    this.httpService.export('/api/giveout/export?' + this.getParams());
  }
  getParams(): string {
    let siteId = this.siteId;
    let outTimeSpan = this.validateForm.get('giveoutTime').value;
    let backTimeSpan = this.validateForm.get('sendbackTime').value;
    let employeeId = this.validateForm.get('employeeId').value;
    let params = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&siteId=${siteId}`;
    console.log(backTimeSpan)
    if (outTimeSpan.length > 0) {
      params += `&outTimeStartStr=${Utils.dateFormat(outTimeSpan[0])}`;
      params += `&outTimeEndStr=${Utils.dateFormat(outTimeSpan[1])}`;
    }
    if (backTimeSpan.length > 0) {
      params += `&backTimeStartStr=${Utils.dateFormat(backTimeSpan[0])}`;
      params += `&backTimeEndStr=${Utils.dateFormat(backTimeSpan[1])}`;
    }
    params += `&employeeId=${employeeId}`;
    return params;
  }
}
