import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpService } from "src/app/public/http/http.service";
import { NzMessageService, NzModalService, NzModalRef, isTemplateRef } from "ng-zorro-antd";
import { LOGIN_KEY } from "src/app/public/common.const";
import { LocalStorageService } from "src/app/public/storage/local-storage.service";
import { Utils } from "src/app/public/util/utils";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.css"],
})
export class OrderListComponent implements OnInit {
  validateForm: FormGroup;
  recordList: any[] = [];
  userName = this.lgs.getObject(LOGIN_KEY).userName;
  statusOptions: Array<{ label: string; value: string }> = [
    { value: "1001", label: "已下单" },
    { value: "1011", label: "已揽件" },
    { value: "1012", label: "已发货/运送中" },
    { value: "1013", label: "到津待派送" },
    { value: "1014", label: "派送中" },
    { value: "1021", label: "已签收" },
    { value: "1031", label: "已丢失" }
  ]



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
      status: [""],
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
    let flightNumber = this.validateForm.get("flightNumber").value;
    let createTimeSpan = this.validateForm.get("createTimeSpen").value;
    let status = this.validateForm.get("status").value;
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
      });
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  airportConfirm(data: any) {
    var dicOrders: Array<{ Id: string; Order_Num: string }> = [{ Id: data.id, Order_Num: data.orderNumber }]
    this.updatestatus(dicOrders);
  }
  batchConfirm() {
    var dicOrders: Array<{ Id: string; Order_Num: string }> = this.recordList.filter((item) => this.mapOfCheckedId[item.id]).map(t => {
      return {
        Id: t.id,
        Order_Num: t.orderNumber
      }
    })
    this.updatestatus(dicOrders);
  }

  updatestatus(dicOrders: Array<{ Id: string; Order_Num: string }>) {
    var params = {
      dicOrders: dicOrders,
      userName: this.lgs.getObject(LOGIN_KEY).userName,
      status: "1012",
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
      nzTitle: '确认?',
      nzContent: '确认这批单已经顺利抵津? 确认后物流信息将同步更新，是否确认?',
      nzOnOk: () =>
        this.airportConfirm(data)
    });
  }
}
