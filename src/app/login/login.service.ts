import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LocalStorageService } from '../public/storage/local-storage.service';
import { Observable } from 'rxjs/internal/Observable';
import { LOGIN_KEY } from '../public/common.const';


/**
 * login服务
 */
@Injectable()
export class LoginService implements CanActivate {
  constructor(private router: Router, private lgs: LocalStorageService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    let loginInfoObj = this.lgs.getObject(LOGIN_KEY);
    if (Object.keys(loginInfoObj).length !== 0) {
      this.router.navigate(['/app']);
      return false;
    } else {
      return true;
    }
  }
}