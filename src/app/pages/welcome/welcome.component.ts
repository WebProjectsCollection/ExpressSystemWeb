import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/public/http/http.service';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { Utils } from 'src/app/public/util/utils';
import { UploadChangeParam, UploadFile } from 'ng-zorro-antd/upload';
import { environment } from 'src/environments/environment';
const baseUrl = environment.apiurl;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  listOfData: any[] = [];
  uniformsSummary: any[] = [];
  employeeSummary: any[] = [];
  startTime: string = '';
  endTime: string = '';
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;
  department = this.lgs.getObject(LOGIN_KEY).department;
  roleName = this.lgs.getObject(LOGIN_KEY).roleName;
  userName = this.lgs.getObject(LOGIN_KEY).chineseName;
  uploadIsVisible = false;
  uploadApi = this.httpService.combineUrl(baseUrl,"/api/user/importEmployee");
  templatePath = this.httpService.combineUrl(baseUrl,"/template/工衣系统-员工信息导入模板.xls");
  fileList: UploadFile[] = [];
  fileList2: UploadFile[] = [];

  constructor(
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
  ) { }

  ngOnInit() {
    this.loadHomeData();
    this.loadUniformTypeData();
  }

  loadHomeData() {
    this.httpService.get('/api/home?siteId=' + this.siteId, res => {
      if (res.code == 100) {
        this.uniformsSummary = res.data.uniforms;
        this.employeeSummary = res.data.employees;
        this.startTime = Utils.dateFormat(new Date(res.data.startTime), 'yyy/MM/dd');
        this.endTime = Utils.dateFormat(new Date(res.data.endTime), 'yyy/MM/dd');
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  loadUniformTypeData() {
    this.httpService.get('/api/uniformtype?siteId=' + this.siteId, res => {
      if (res.code == 100) {
        this.listOfData = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
  }
  handleChange({file}: UploadChangeParam): void {
    this.fileList=[file];
    const status = file.status;
    if (status === 'done') {
      console.log(file);
      var result = file.response;
      if(result.status==200){
        this.msg.success(result.msg);
        this.loadHomeData();
      }else{
        this.msg.error(result.msg);
        console.log(result.error);
      }
    } else if (status === 'error') {
      console.log(file);
      this.msg.error(`上传失败：${file.error.error}`);
    }
  }
  showUploader(): void {
    this.uploadIsVisible = true;
    console.log(this.fileList)
  }
  handleCancel(): void {
    this.uploadIsVisible = false;
  }
  downloadTemplate():void{
    window.open(this.templatePath)
  }
}
