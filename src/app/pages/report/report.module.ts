import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';
import { ApplyRecordComponent } from './apply-record/apply-record.component';
import { ChargeRecordComponent } from './charge-record/charge-record.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule, NzFormModule, NzInputModule, NzButtonModule, NzSelectModule, NzTimePickerModule, NzDatePickerModule, NzDividerModule, NzGridModule, NzIconModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [ReportComponent, ApplyRecordComponent, ChargeRecordComponent],
  imports: [
    CommonModule,
    ReportRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTimePickerModule,
    NzDatePickerModule  ,
    NzDividerModule ,
    NzGridModule ,
    NzIconModule ,
  ]
})
export class ReportModule { }
