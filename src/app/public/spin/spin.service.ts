import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SpinService {

  private spinSubject = new Subject<boolean>();

  constructor() { }

  getSpin(): Observable<boolean> {
    return this.spinSubject;
  }


  spin(showSpin: boolean) {
    this.spinSubject.next(showSpin);
  }

  show() {
    this.spin(true);
  }

  hide() {
    this.spin(false);
  }
}
