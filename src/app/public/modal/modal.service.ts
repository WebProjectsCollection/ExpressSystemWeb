import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class ModalService {

  constructor(
    private modalService: NzModalService
  ) { }

  public confirm(title: string, content: string, onOK: Function, onCancel: Function = null) {
    this.modalService.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: onOK == null ? null : () => onOK(),
      nzCancelText: '取消',
      nzOnCancel: onCancel == null ? null : () => onCancel()
    });
  }

  public error(content: string): void {
    this.modalService.error({
      nzTitle: '错误',
      nzContent: content
    });
  }
}
