import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
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
     userName: [null, [Validators.required]],
     chineseName: [null, [Validators.required]],
     role: [null, [Validators.required]],
    });
    this.httpService.get('/api/role/list', res => {
      if (res.code == 100) {
        this.roleList = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  loadData() {
    this.httpService.get('/api/user', res => {
      if (res.code == 100) {
        this.loadDataSet = res.data;
        this.search();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  search(): void {
    const filterFunc = (item: { userName: number; chineseName: string; roleName: string; }) => {
      return (item.userName.toString().indexOf(this.searchValue) !== -1
        || item.chineseName.indexOf(this.searchValue) !== -1
        || item.roleName.indexOf(this.searchValue) !== -1);
    };
    this.dataSet = this.loadDataSet.filter((item: { userName: number; chineseName: string; roleName: string; }) => filterFunc(item));
  }

  editUser(data = null): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
    this.isNew = true;
    if (data != null) {
      this.isNew = false;
      this.validateForm.get('userName').setValue(data.userName);
      this.validateForm.get('chineseName').setValue(data.chineseName);
      this.validateForm.get('role').setValue(data.roleId);
    }
    this.isVisible = true;
  }

  handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      var data = {
        isNew: this.isNew,
        userName: this.validateForm.get('userName').value,
        roleId: this.validateForm.get('role').value,
        chineseName: this.validateForm.get('chineseName').value,
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
        this.httpService.delete('/api/user/' + data.userName, res => {
          if (res.code == 100) {
            this.loadData();
          } else {
            this.msg.error(res.msg);
          }
        });
      }
    );
  }
  resetPassword(data) {
    this.modalService.confirm(`确定重置用户 ${data.chineseName} 的密码吗？`, '',
      () => {
        this.httpService.post('/api/user/resetPassword', {userName:data.userName}, res => {
          if (res.code == 100) {
            this.msg.success("密码重置成功");
          } else {
            this.msg.error(res.msg);
          }
        });
      }
    );
  }
}
