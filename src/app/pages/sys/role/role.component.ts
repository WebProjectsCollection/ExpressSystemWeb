import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/public/http/http.service';
import { NzMessageService, NzFormatEmitEvent, NzTreeNodeOptions, NzTreeComponent, arraysEqual, NzTreeNode } from 'ng-zorro-antd';
import { LOGIN_KEY } from 'src/app/public/common.const';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  dataSet: any[];
  isVisible = false;
  checkedNodes = [];
  selectedRoleId = '';
  nodes: NzTreeNodeOptions[] = [];
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent: NzTreeComponent;

  constructor(
    private httpService: HttpService,
    private lgs: LocalStorageService,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
    this.httpService.get('/api/role/list', res => {
      if (res.code == 100) {
        this.dataSet = res.data;
      } else {
        this.msg.error(res.msg);
      }
    });

    this.httpService.get('/api/menu', res => {
      if (res.code == 100) {
        this.nodes = this.loadParents(res.data);
      } else {
        this.msg.error(res.msg);
      }
    });
  }


  // on tree nodes check change
  nzCheck(event: NzFormatEmitEvent): void {
    this.checkedNodes = [];
    this.getCheckedNode(this.nzTreeComponent.getCheckedNodeList());
  }

  // 获取选中菜单节点
  getCheckedNode(ns: NzTreeNode[]) {
    ns.forEach(n => {
      if (n.level == 0) {
        this.getCheckedNode(n.children);
      } else {
        this.checkedNodes.push(n.key);
      }
    });
  }

  // 加载所有一级菜单
  loadParents(menus: any): Array<NzTreeNodeOptions> {
    var parents = new Array<NzTreeNodeOptions>();
    menus.forEach(menu => {
      parents.push({
        title: menu.menuText,
        key: menu.menuID,
        expanded: true,
        children: this.loadChildren(menu.children)
      });
    });
    return parents;
  }
  // 加载二级菜单
  loadChildren(submenus: any): Array<NzTreeNodeOptions> {
    var children = new Array<NzTreeNodeOptions>();
    submenus.forEach(submenu => {
      children.push({
        title: submenu.menuText,
        key: submenu.menuID,
        isLeaf: true
      });
    });
    return children;
  }

  // 分配权限
  grant(data): void {
    this.selectedRoleId = data.roleID;
    // 更新选中菜单
    this.httpService.get('/api/role/menus?roleId=' + this.selectedRoleId, res => {
      if (res.code == 100) {
        this.checkedNodes = res.data;
        this.nodes.forEach(n => {
          n.checked = false;
          n.children.forEach(sn => {
            sn.checked = this.checkedNodes.indexOf(sn.key) > -1;
          })
        })
        this.nodes = [...this.nodes];
        this.isVisible = true;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  // 保存数据
  handleOk(): void {
    var data = {
      roleId: this.selectedRoleId,
      menuIds: this.checkedNodes
    };
    console.log(this.checkedNodes)
    this.httpService.post('/api/role/menu', data, res => {
      if (res.code == 100) {
        this.isVisible = false;
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
