import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN, NzModalModule } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpClientModule } from '@angular/common/http';
import { SpinComponent } from './public/spin/spin.component';
import { SpinService } from './public/spin/spin.service';
import { HttpService } from './public/http/http.service';
import { SessionStorageService } from './public/storage/session-storage.service';
import { LocalStorageService } from './public/storage/local-storage.service';
import { LoginService } from './login/login.service';
import { ModalService } from './public/modal/modal.service';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    SpinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NzModalModule 
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    SpinService,
    HttpService,
    LocalStorageService,
    SessionStorageService,
    LoginService,
    ModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
