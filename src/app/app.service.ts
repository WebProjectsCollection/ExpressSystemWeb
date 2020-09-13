import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from './public/storage/local-storage.service';
import { HttpService } from './public/http/http.service';
import { Observable } from 'rxjs';
import { LOGIN_KEY, SITENAME_KEY } from './public/common.const';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private router: Router,
    private lgs: LocalStorageService,
    private http: HttpService
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    let loginInfoObj = this.lgs.getObject(LOGIN_KEY);
    if (Object.keys(loginInfoObj).length !== 0) {
      let that = this;
      return new Promise(function (resolve, reject) {
        that.http.get('api/account/checkToken?token=' + loginInfoObj['token'],
          function (res) {
            if (res.code == 100) {
              resolve(true);
            } else {
              that.lgs.remove(LOGIN_KEY);
              that.lgs.remove(SITENAME_KEY);
              that.router.navigate(['/login']);
              reject(false);
            }
          }, function () {
            that.lgs.remove(LOGIN_KEY);
            that.lgs.remove(SITENAME_KEY);
            that.router.navigate(['/login']);
            reject(false);
          })
      })
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
