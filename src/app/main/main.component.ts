import { Component, OnInit } from '@angular/core';
import { MenuData } from './main-model';
import { HttpService } from '../public/http/http.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LocalStorageService } from '../public/storage/local-storage.service';
import { LOGIN_KEY, SITENAME_KEY } from '../public/common.const';
import { ModalService } from '../public/modal/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isCollapsed = false;
  menuList: MenuData[] = [];
  userName: string;
  siteName: string;
  roleId: number;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private msg: NzMessageService,
    private modalService: ModalService,
    private lgs: LocalStorageService
  ) { }

  ngOnInit() {
    this.getMenuList();
    let loginInfo = this.lgs.getObject(LOGIN_KEY);
    this.userName = loginInfo.chineseName;
    this.roleId = loginInfo.roleId;
    this.siteName = this.lgs.get(SITENAME_KEY);
  }

  getMenuList() {
    let that = this;
    this.httpService.get('/api/menu', res => {
      if (res.code == 100) {
        var tempMenuList = res.data;
        that.httpService.get('/api/role/menus?roleId=' + this.roleId, res2 => {
          if (res2.code == 100) {
            var roleMenuIds = res2.data;
            tempMenuList.forEach(parent => {
              parent.children.forEach(children => {
                if (roleMenuIds.indexOf(children.menuID) > -1) {
                  children.isShow = true;
                  parent.isShow = true;
                }
              });
            });
            that.menuList = tempMenuList;
          } else {
            that.msg.error(res2.msg);
          }
        });
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  logout() {
    this.modalService.confirm('确定退出系统吗？', '',
      () => {
        this.lgs.remove(LOGIN_KEY);
        this.lgs.remove(SITENAME_KEY);
        this.httpService.get('/api/account/logout', () => {
          this.router.navigate(['/login']);
        })
      }
    );
  }
  changePassword(){
    this.router.navigate(['/app/sys/changePassword']);
  }
}
