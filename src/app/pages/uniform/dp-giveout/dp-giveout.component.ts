import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "src/app/public/http/http.service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorageService } from "src/app/public/storage/local-storage.service";
import { LOGIN_KEY } from "src/app/public/common.const";
import { ModalService } from "src/app/public/modal/modal.service";
import { Utils } from "src/app/public/util/utils";

@Component({
  selector: "app-dp-giveout",
  templateUrl: "./dp-giveout.component.html",
  styleUrls: ["./dp-giveout.component.css"],
})
export class DpGiveoutComponent implements OnInit {
  mgBadgeId: string;
  mgStockInfo: any = {};
  badgeId: string;
  data = [];
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;
  uniformTypes: any[] = [];
  uniformSeasons: any[] = [];
  selectSeason: string;
  selectTypes: any[] = [];
  applyNumber: number = 0;
  userInfo: any = {};
  btnEnable: boolean = false;
  isVisible = false;
  needSubmit = false;

  constructor(
    private httpService: HttpService,
    private msg: NzMessageService,
    private lgs: LocalStorageService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.httpService.get("/api/uniformtype?siteId=" + this.siteId, (res) => {
      if (res.code == 100) {
        this.uniformTypes = res.data;
        this.getSessions();
      } else {
        this.modalService.error(res.msg);
      }
    });
  }
  getSessions() {
    this.httpService.get(
      "/api/uniformtype/session?siteId=" + this.siteId,
      (res) => {
        if (res.code == 100) {
          res.data.forEach((v) => {
            this.uniformSeasons.push({ season: v });
          });
          this.uniformSeasons = [...this.uniformSeasons];
          this.getDefaultSetting();
        } else {
          this.modalService.error(res.msg);
        }
      }
    );
  }

  getDefaultSetting() {
    this.httpService.get("/api/defaultSetting?siteId=" + this.siteId, (res) => {
      if (res.code == 100) {
        if (res.data) {
          this.selectSeason = res.data.uniformType;
          this.applyNumber = res.data.applyNumber;
          this.loadUniformInfo();
        }
      } else {
        this.modalService.error(res.msg);
      }
    });
  }

  loadUniformInfo() {
    this.selectTypes = [];
    if (this.selectSeason && this.uniformTypes) {
      this.uniformTypes.forEach((v) => {
        if (v.season == this.selectSeason) {
          this.selectTypes.push(v);
        }
      });
      this.selectTypes = [...this.selectTypes];
    }
  }

  getManagerStockInfo() {
    this.mgStockInfo = {};
    if (!this.mgBadgeId || !this.mgBadgeId.trim()) {
      this.msg.warning("请输入管理员卡号！");
      return;
    }
    this.mgBadgeId = Utils.clearBadgeId(this.mgBadgeId);
    this.httpService.get(
      "/api/user/stockInfo?badgeId=" + this.mgBadgeId,
      (res) => {
        if (res.code == 100) {
          this.mgStockInfo = res.data;
          if (this.mgStockInfo && this.mgStockInfo.stockList.length == 0) {
            this.msg.warning("管理员持有工衣数量为0");
          }
        } else {
          this.modalService.error(res.msg);
        }
      }
    );
  }

  enterBadgeId() {
    if (this.needSubmit) {
      this.giveout(
        () => {
          this.getUserInfo();
        },
        () => {
          this.badgeId = "";
          this.userInfo = {};
        }
      );
    } else {
      this.getUserInfo();
    }
  }
  getUserInfo() {
    this.userInfo = {};
    this.btnEnable = false;
    if (!this.badgeId || !this.badgeId.trim()) {
      this.msg.warning("请输入员工卡号！");
      return;
    }
    this.badgeId = Utils.clearBadgeId(this.badgeId);
    this.httpService.get("/api/user/info?badgeId=" + this.badgeId, (res) => {
      if (res.code == 100) {
        this.userInfo = res.data;
        this.btnEnable = true;
        this.badgeId = "";
        this.needSubmit = true;
      } else {
        this.modalService.error(res.msg);
      }
    });
  }

  checkParams(): boolean {
    if (!(this.btnEnable && this.selectTypes.length > 0 && this.applyNumber)) {
      return false;
    }
    if (!this.userInfo.employeeID) {
      this.modalService.error("请输入并确认领取人信息！");
      this.needSubmit = false;
      return false;
    }
    // 校验数据
    var msgPrefix = this.userInfo.chineseName
      ? this.userInfo.chineseName + "领取失败："
      : "";
    if (!this.mgStockInfo || !this.mgBadgeId) {
      this.modalService.error(msgPrefix + "请输入有效的部门管理员卡号！");
      return false;
    }
    if (!this.mgStockInfo.stockList || this.mgStockInfo.stockList.length == 0) {
      this.modalService.error(msgPrefix + "管理员未持有工服！");
      return false;
    }
    var isOk = true;
    this.selectTypes.forEach((v1) => {
      var isFind = false;
      this.mgStockInfo.stockList.forEach((v2) => {
        if (v1.style == v2.style && this.applyNumber <= v2.stock) {
          isFind = true;
        }
      });
      if (isFind == false) {
        this.modalService.error(
          msgPrefix + '管理员持有工服"' + v1.style + '"数量不足！'
        );
        isOk = false;
      }
    });
    return isOk;
  }

  giveout(success: Function = null, error: Function = null): void {
    if (!this.checkParams()) {
      if (error != null) {
        error();
      }
      return;
    }
    var data = {
      siteId: this.siteId,
      fromEmployeeId: this.mgStockInfo.employeeID,
      toEmployeeId: this.userInfo.employeeID,
      uniforms: this.selectTypes,
      applyNumber: this.applyNumber,
      applyType: 1, // 发放到个人
    };
    this.httpService.post("/api/giveout", data, (res) => {
      if (res.code == 100) {
        this.msg.info(this.userInfo.chineseName + "领取成功！");
        // 刷新管理员库存
        this.getManagerStockInfo();
        this.needSubmit = false;
        this.isVisible = false;
        if (success != null) {
          success();
        } else {
          this.userInfo = {};
        }
      } else {
        this.modalService.error(
          this.userInfo.chineseName + "领取失败：" + res.msg
        );
        if (error != null) {
          error();
        }
      }
    });
  }
}
