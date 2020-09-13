import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { FnParam } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-manager-stock',
  templateUrl: './manager-stock.component.html',
  styleUrls: ['./manager-stock.component.css']
})
export class ManagerStockComponent implements OnInit {
  validateForm: FormGroup;
  recordList: any[] = [];
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;
  isVisible = false;
  fromUser: any = [];
  toUserEmployeeId = '';
  toUser: any = [];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      employeeId: [''],
    });
    this.searchData();
  }

  getParams(): string {
    let siteId = this.siteId;
    let employeeId = this.validateForm.get('employeeId').value;
    let params = `siteId=${siteId}`;
    params += `&employeeId=${employeeId}`;
    return params;
  }

  searchData(reset: boolean = false) {
    this.recordList = [];
    this.httpService.get('/api/managerstock?' + this.getParams(), res => {
      if (res.code == 100) {
        this.recordList = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  showModal(data: any): void {
    this.isVisible = true;
    this.fromUser = data;
    this.toUserEmployeeId = '';
    this.toUser = {};
  }

  getToUserInfo() {
    var params = 'siteId=' + this.siteId + '&roleCode=departmentAdmin&employeeId=' + this.toUserEmployeeId;
    this.httpService.get('/api/user/getByRole?' + params, res => {
      if (res.code == 100) {
        this.toUser = res.data
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  handleOk(): void {
    if (!this.toUser.employeeID) {
      this.msg.warning('请选择接收工衣的管理员！');
      return;
    }
    var uniforms = [];
    this.recordList.forEach(item => {
      if (item.employeeID == this.fromUser.employeeID) {
        uniforms.push({
          style: item.uniformStyle,
          season: item.uniformSeason,
          stock: item.total
        });
      }
    })
    var data = {
      siteId: this.siteId,
      fromEmployeeId: this.fromUser.employeeID,
      toEmployeeId: this.toUserEmployeeId,
      uniforms: uniforms
    }
    if (data.fromEmployeeId == data.toEmployeeId) {
      this.msg.error('请选择其他管理员！');
      return;
    }
    this.httpService.post('/api/managerStock/transfer', data, res => {
      if (res.code == 100) {
        this.msg.info('移交成功！');
        // 刷新管理员库存
        this.searchData();
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
