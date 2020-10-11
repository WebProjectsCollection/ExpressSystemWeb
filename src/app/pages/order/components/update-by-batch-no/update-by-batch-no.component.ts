import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { HttpService } from "src/app/public/http/http.service";
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';

@Component({
  selector: 'app-update-by-batch-no',
  templateUrl: './update-by-batch-no.component.html',
  styleUrls: ['./update-by-batch-no.component.css']
})
export class UpdateByBatchNoComponent implements OnInit {
  detailVisible: boolean = true;
  batchNoOptions: Array<{ label: string; value: string }> = [];
  batchNo: string = "";
  @Input() action: string = "";
  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  @Output() onConfirm: EventEmitter<any> = new EventEmitter();

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
    private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.get("/api/order/batchNos", (res) => {
      if (res.code == 100) {
        this.batchNoOptions = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
  
  showConfirm(): void {
    if (this.batchNo === "") {
      this.msg.warning("请选择物流批次！");
      return;
    }
    this.modal.confirm({
      nzTitle: "确认?",
      nzContent: "确认更新物流批次：" + this.batchNo + "? 确认后物流信息将同步更新，是否确认?",
      nzOnOk: () => this.updateStatus(),
    });
  }

  updateStatus(): void{
    var params = {
      batchNumber: this.batchNo,
      action: this.action,
      userName : this.lgs.getObject(LOGIN_KEY).userName,
    };
    this.httpService.post("/api/order/UpdateStatusByBatchNumber", params, (res) => {
      if (res.code == 100) {
        this.msg.success("操作成功");
        this.onConfirm.emit();
      } else {
        this.msg.error(res.msg);
      }
    });
  }
}
