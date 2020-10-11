import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpService } from "src/app/public/http/http.service";
import {
  NzMessageService,
  NzModalService,
  NzModalRef,
  isTemplateRef,
} from "ng-zorro-antd";
import { LOGIN_KEY } from "src/app/public/common.const";
import { LocalStorageService } from "src/app/public/storage/local-storage.service";
import { Utils } from "src/app/public/util/utils";

@Component({
  selector: "app-jbbw-receive",
  templateUrl: "./jbbw-receive.component.html",
  styleUrls: ["./jbbw-receive.component.css"],
})
export class JbbwReceiveComponent implements OnInit {
  validateForm: FormGroup;
  recordList: any[] = [];
  userName = this.lgs.getObject(LOGIN_KEY).userName;

  batchNoOptions: Array<{ label: string; value: string }> = [];
  isAllDataChecked = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  pageIndex = 1;
  pageSize = 10;
  total = 1;

  isVisible: boolean = false;
  orderinfo: any = {};
  confirmModal: NzModalRef;

  updateBatchVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      orderNumber: [""],
      status: ["1012"],
      batchNo: [""],
      keyWord: [""],
      flightNumber: [""],
      createTimeSpen: [[]],
    });
    this.httpService.get("/api/order/batchNos", (res) => {
      if (res.code == 100) {
        this.batchNoOptions = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });
    this.searchData();
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.total = 0;
    this.recordList = [];
    this.httpService.get("/api/order?" + this.getParams(), (res) => {
      if (res.code == 100) {
        this.total = res.data.total;
        this.recordList = res.data.list;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  getParams(): string {
    let orderNumber = this.validateForm.get("orderNumber").value;
    let keyWord = this.validateForm.get("keyWord").value;
    let status = this.validateForm.get("status").value;
    let batchNo = this.validateForm.get("batchNo").value;
    let params = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
    params += `&orderNumber=${orderNumber}&keyWord=${keyWord}`;
    params += `&status=${status}`;
    if (batchNo != null)
      params += `&batchNo=${batchNo}`;
    return params;
  }

  checkAll(value: boolean): void {
    this.recordList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  refreshStatus(): void {
    this.isAllDataChecked = this.recordList.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.numberOfChecked = this.recordList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
  }
  detail(data: any) {
    this.isVisible = true;
    this.httpService.get(
      `/api/order/detail?orderNumber=${data.orderNumber}`,
      (res) => {
        this.orderinfo = res.data;
      }
    );
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  airportConfirm(data: any) {
    var dicOrders: Array<{ Id: string; Order_Num: string }> = [
      { Id: data.id, Order_Num: data.orderNumber },
    ];
    this.updatestatus(dicOrders);
  }
  batchConfirm() {
    var dicOrders: Array<{ Id: string; Order_Num: string }> = this.recordList
      .filter((item) => this.mapOfCheckedId[item.id])
      .map((t) => {
        return {
          Id: t.id,
          Order_Num: t.orderNumber,
        };
      });
    if (this.checkValid(dicOrders)) {
      this.msg.warning("请至少勾选一项进行确认");
      return;
    }
    this.updatestatus(dicOrders);
  }

  checkValid(dicOrders: any) {
    if (dicOrders != null && dicOrders.length > 0)
      return false;
    return true;
  }
  updatestatus(dicOrders: Array<{ Id: string; Order_Num: string }>) {
    var params = {
      dicOrders: dicOrders,
      userName: this.lgs.getObject(LOGIN_KEY).userName,
      status: "1013",
    };
    this.httpService.post("/api/order/updatestatus", params, (res) => {
      if (res.code == 100) {
        this.msg.success("操作成功");
        this.searchData();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  showConfirm(data: any): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: "确认?",
      nzContent: "确认这批单已上飞机? 确认后物流信息将同步更新，是否确认?",
      nzOnOk: () => this.airportConfirm(data),
    });
  }
  
  
  updateByBatchNo() {
    this.updateBatchVisible = true;
  }

  handleUpdateBatchCancel(): void {
    this.updateBatchVisible = false;
  }
  handleUpdateBatchConfirm(): void {
    this.updateBatchVisible = false;
    // 更新列表
    this.searchData();
  }
}
