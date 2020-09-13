import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { Utils } from 'src/app/public/util/utils';

@Component({
  selector: 'app-charge-record',
  templateUrl: './charge-record.component.html',
  styleUrls: ['./charge-record.component.css']
})
export class ChargeRecordComponent implements OnInit {
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
      employeeId: [''],
      isActive: [''],
      leaveTime: [[]],
    });
    this.searchData();
  }

  getParams(): string {
    let siteId = this.siteId;
    let employeeId = this.validateForm.get('employeeId').value;
    let isActive = this.validateForm.get('isActive').value;
    let leaveTimeSpan = this.validateForm.get('leaveTime').value;
    let params = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&siteId=${siteId}`;
    params += `&employeeId=${employeeId}`;
    params += `&status=${isActive || ''}`;
    if (leaveTimeSpan.length > 0 && isActive =='0') {
      params += `&outTimeStartStr=${Utils.dateFormat(leaveTimeSpan[0])}`;
      params += `&outTimeEndStr=${Utils.dateFormat(leaveTimeSpan[1])}`;
    }
    return params;
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.total = 0;
    this.recordList = [];
    this.httpService.get('/api/sendback/record?' + this.getParams(), res => {
      if (res.code == 100) {
        this.total = res.data.total;
        this.recordList = res.data.list;
      } else {
        this.msg.error(res.msg);
      }
    });
  }
  export() {
    this.httpService.export('/api/sendback/export?' + this.getParams());
  }
}

