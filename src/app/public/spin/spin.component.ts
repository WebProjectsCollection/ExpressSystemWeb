import { Component, OnInit } from '@angular/core';
import { SpinService } from './spin.service';

@Component({
  selector: 'app-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.css']
})
export class SpinComponent{

  //标识
  showSpin: boolean = false;

  //数量
  count: number = 0;

  constructor(private spinService: SpinService) {
      this.spinService.getSpin().forEach((showSpin: boolean) => {
          if (showSpin) {
              this.openSpin();
          } else {
              this.closeSpin();
          }
      });
  }

  /**
   * 打开
   */
  private openSpin() {
      if (!this.showSpin) {
          this.showSpin = true;
      }
      this.count++;
  }

  /**
   * 关闭
   */
  private closeSpin() {
      this.count--;
      if (this.count <= 0) {
          this.showSpin = false;
          this.count = 0;
      }

  }

}
