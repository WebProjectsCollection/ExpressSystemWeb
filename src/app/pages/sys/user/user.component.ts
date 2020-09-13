import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { ModalService } from 'src/app/public/modal/modal.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isVisible = false;
  dataSet: any[];
  loadDataSet: any[];
  searchValue: string = '';
  validateForm: FormGroup;
  newUser: any = {};
  roleList: any[] = [];
  isNew: boolean = true;

  constructor(
    private lgs: LocalStorageService,
    private fb: FormBuilder,
    private httpService: HttpService,
    private msg: NzMessageService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.validateForm = this.fb.group({
      ntid: [null, [Validators.required]],
      fullName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      role: [null, [Validators.required]],
      employeeId: [{ value: '', disabled: true }]
    });
    var siteId = this.lgs.getObject(LOGIN_KEY).siteId;
    this.httpService.get('/api/role/list?siteId=' + siteId, res => {
      if (res.code == 100) {
        this.roleList = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  loadData() {
    var siteId = this.lgs.getObject(LOGIN_KEY).siteId;
    this.httpService.get('/api/user?siteId=' + siteId, res => {
      if (res.code == 100) {
        this.loadDataSet = res.data;
        this.search();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  search(): void {
    const filterFunc = (item: { employeeID: number; chineseName: string; emailAddress: string; roleName: string; }) => {
      return (item.employeeID.toString().indexOf(this.searchValue) !== -1
        || item.chineseName.indexOf(this.searchValue) !== -1
        || item.emailAddress.indexOf(this.searchValue) !== -1
        || item.roleName.indexOf(this.searchValue) !== -1);
    };
    this.dataSet = this.loadDataSet.filter((item: { employeeID: number; chineseName: string; emailAddress: string; roleName: string; }) => filterFunc(item));
  }

  editUser(data = null): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
    this.isNew = true;
    if (data != null) {
      this.isNew = false;
      this.validateForm.get('ntid').setValue(data.ntid);
      this.validateForm.get('department').setValue(data.department);
      this.validateForm.get('fullName').setValue(data.chineseName);
      this.validateForm.get('email').setValue(data.emailAddress);
      this.validateForm.get('employeeId').setValue(data.employeeID);
      this.validateForm.get('role').setValue(data.roleId);
    }
    this.isVisible = true;
  }

  changeNTID() {
    var ntid = this.validateForm.get('ntid').value;
    this.httpService.get('/api/user/' + ntid, res => {
      if (res.code == 100) {
        this.validateForm.get('department').setValue(res.data.department);
        this.validateForm.get('fullName').setValue(res.data.displayName);
        this.validateForm.get('email').setValue(res.data.mail);
        this.validateForm.get('employeeId').setValue(res.data.employeeID);
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      var data = {
        isNew: this.isNew,
        ntid: this.validateForm.get('ntid').value,
        roleId: this.validateForm.get('role').value,
        employeeId: this.validateForm.get('employeeId').value,
      }
      this.httpService.post('/api/user', data, res => {
        if (res.code == 100) {
          this.isVisible = false;
          this.loadData();
        } else {
          this.msg.error(res.msg);
        }
      });
    }
  }

  handleCancel() {
    this.isVisible = false;
  }

  delete(data) {
    this.modalService.confirm(`确定删除用户 ${data.chineseName} 吗？`, '',
      () => {
        this.httpService.delete('/api/user/' + data.ntid, res => {
          if (res.code == 100) {
            this.loadData();
          } else {
            this.msg.error(res.msg);
          }
        });
      }
    );
  }
}
