import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpService } from "src/app/public/http/http.service";
import { NzMessageService } from "ng-zorro-antd";
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

  isAllDataChecked = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  pageIndex = 1;
  pageSize = 10;
  total = 1;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      orderNumber: [""],
      keyWord: [""],
      flightNumber: [""],
      createTimeSpen: [[]],
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
    let params = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`;
    if (createTimeSpan.length > 0) {
      params += `&createTimeStartStr=${Utils.dateFormat(createTimeSpan[0])}`;
      params += `&createTimeEndStr=${Utils.dateFormat(createTimeSpan[1])}`;
    }
    params += `&orderNumber=${orderNumber}&keyWord=${keyWord}&flightNumber=${flightNumber}`;
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
    console.log(data);
  }
  guangzhouConfirm(data: any) {
    console.log(data);
  }
  airportConfirm(data: any) {
    console.log(data);
  }
}
