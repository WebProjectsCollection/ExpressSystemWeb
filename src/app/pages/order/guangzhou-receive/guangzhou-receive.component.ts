import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpService } from "src/app/public/http/http.service";
import { NzMessageService, NzModalService, NzModalRef } from "ng-zorro-antd";
import { LOGIN_KEY } from "src/app/public/common.const";
import { LocalStorageService } from "src/app/public/storage/local-storage.service";
import { Utils } from "src/app/public/util/utils";
@Component({
  selector: "app-guangzhou-receive",
  templateUrl: "./guangzhou-receive.component.html",
  styleUrls: ["./guangzhou-receive.component.css"],
})
export class GuangzhouReceiveComponent implements OnInit {
  queryForm: FormGroup;
  recordList: any[] = [];
  userName = this.lgs.getObject(LOGIN_KEY).userName;
  statusOptions: Array<{ label: string; value: string }> = [
    { value: "1001", label: "已下单" },
  ];

  batchNoOptions: Array<{ label: string; value: string }> = [];
  isAllDataChecked = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  pageIndex = 1;
  pageSize = 10;
  total = 1;

  detailVisible: boolean = false;
  ordernumber: string = "";
  confirmModal: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      orderNumber: [""],
      status: ["1001"],
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
    let orderNumber = this.queryForm.get("orderNumber").value;
    let keyWord = this.queryForm.get("keyWord").value;
    let flightNumber = this.queryForm.get("flightNumber").value;
    let createTimeSpan = this.queryForm.get("createTimeSpen").value;
    let status = this.queryForm.get("status").value;
    let params = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
    if (createTimeSpan.length > 0) {
      params += `&createTimeStartStr=${Utils.dateFormat(createTimeSpan[0])}`;
      params += `&createTimeEndStr=${Utils.dateFormat(createTimeSpan[1])}`;
    }
    params += `&orderNumber=${orderNumber}&keyWord=${keyWord}&flightNumber=${flightNumber}`;
    params += `&status=${status}`;
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
  }
  detail(data: any) {
    this.ordernumber = data.orderNumber;
    this.detailVisible = true;
  }
  handleDetailCancel(): void {
    this.detailVisible = false;
  }

  airportConfirm(data: any) {
    var dicOrders: Array<{ Id: string; Order_Num: string }> = [
      { Id: data.id, Order_Num: data.orderNumber },
    ];
    this.showConfirm(dicOrders);
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
    this.showConfirm(dicOrders);
  }
  showConfirm(data: any): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: "确认?",
      nzContent: "确认这批单已揽件? 确认后物流信息将同步更新，是否确认?",
      nzOnOk: () => this.updatestatus(data),
    });
  }
  updatestatus(dicOrders: Array<{ Id: string; Order_Num: string }>) {
    var params = {
      dicOrders: dicOrders,
      userName: this.lgs.getObject(LOGIN_KEY).userName,
      status: "1011",
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
}
