import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { NgZorroAntdModule, NzListModule, NzModalModule, NzDropDownModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    //BrowserModule,
    //IconsProviderModule,
    //FormsModule ,
    NgZorroAntdModule,
    //HttpClientModule,
    //BrowserAnimationsModule,
    NzListModule,
    NzDropDownModule 
  ]
})
export class MainModule { }
