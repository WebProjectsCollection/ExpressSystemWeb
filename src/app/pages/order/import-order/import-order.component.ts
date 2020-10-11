import { Component, OnInit } from "@angular/core";
import { LOGIN_KEY } from "src/app/public/common.const";
import { HttpService } from 'src/app/public/http/http.service';
import { LocalStorageService } from "src/app/public/storage/local-storage.service";
import { environment } from 'src/environments/environment';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd';
import { SpinService } from 'src/app/public/spin/spin.service';
const baseUrl = environment.apiurl;

@Component({
  selector: 'app-import-order',
  templateUrl: './import-order.component.html',
  styleUrls: ['./import-order.component.css']
})
export class ImportOrderComponent implements OnInit {
  resultList: any[] = [];
  userName = this.lgs.getObject(LOGIN_KEY).userName;
  uploadApi = this.httpService.combineUrl(baseUrl,"/api/order/importOrder?userName=" + this.userName);
  templatePath = this.httpService.combineUrl(baseUrl,"/template/快递单导入模板.xlsx");
  uploading = false;

  constructor(
    private httpService: HttpService,
    private lgs: LocalStorageService,
    private msg: NzMessageService,
    private spinService: SpinService,
  ) {}

  ngOnInit(): void {
  }

  downloadTemplate():void{
    window.open(this.templatePath)
  }
  handleChange({ file }: UploadChangeParam): void {
    const status = file.status;
    if (status === 'uploading' && !this.uploading) { 
      this.uploading = true;
      this.spinService.show();
    } else if (status === 'done') {  
      this.uploading = false; 
      this.spinService.hide();
      this.resultList = [];
      console.log(file);
      var result = file.response;
      if(result.status==200){
        this.msg.success(result.msg);
        this.resultList = result.data;
      }else{
        this.msg.error(result.msg);
        console.log(result.error);
      }
    } else if (status === 'error') { 
      this.uploading = false;    
      this.spinService.hide();
      console.log(file);
      this.msg.error(`上传失败：${file.error.error}`);
    }
  }
 
}
