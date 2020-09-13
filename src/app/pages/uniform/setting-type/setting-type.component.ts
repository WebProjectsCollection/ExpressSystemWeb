import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/public/http/http.service';
import { LocalStorageService } from 'src/app/public/storage/local-storage.service';
import { LOGIN_KEY } from 'src/app/public/common.const';

interface ItemData {
  id: string;
  season: string,
  style: string,
  price: number,
  stock: number
}


@Component({
  selector: 'app-setting-type',
  templateUrl: './setting-type.component.html',
  styleUrls: ['./setting-type.component.css']
})
export class SettingTypeComponent implements OnInit {
  constructor(
    private msg: NzMessageService,
    private httpService: HttpService,
    private lgs: LocalStorageService
  ) { }

  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [];
  idNumber = 0;
  siteId = this.lgs.getObject(LOGIN_KEY).siteId;
  infoMsg = '【注意】款式不能重复；操作完数据后，请点击右下角保存按钮';

  addRow(): void {
    var newItem =
    {
      id: `${this.idNumber}`,
      season: '',
      style: '',
      price: 0,
      stock: 0
    }
    this.listOfData = [...this.listOfData, newItem];
    this.editCache[newItem.id] = { edit: false, data: { ...newItem } };
    this.idNumber++;
    this.startEdit(newItem.id);
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  saveEdit(id: string): void {
    var temp = this.editCache[id].data;
    if (temp.season && temp.style && temp.stock.toString() != '' && temp.price.toString() != '') {
      const index = this.listOfData.findIndex(item => item.id === id);
      Object.assign(this.listOfData[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    } else {
      this.msg.error("请将信息填写完整！");
    }
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }

  ngOnInit(): void {
    this.loadUniformTypeData();
  }

  loadUniformTypeData() {
    this.httpService.get('/api/uniformtype?siteId=' + this.siteId, res => {
      if (res.code == 100) {
        this.listOfData = res.data;
        this.listOfData.forEach(v => v.id = (this.idNumber++).toString());
        this.updateEditCache();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  saveUniformTypeData() {
    var data = {
      siteId: this.siteId,
      types: this.listOfData
    }
    this.httpService.post('/api/uniformtype', data, res => {
      if (res.code == 100) {
        this.msg.success('保存成功！');
        this.loadUniformTypeData();
      } else {
        this.msg.error(res.msg);
      }
    });
  }
}
