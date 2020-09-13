import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { ApplyRecordComponent } from './apply-record/apply-record.component';
import { ChargeRecordComponent } from './charge-record/charge-record.component';


const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      { path: 'apply', component: ApplyRecordComponent },
      { path: 'charge', component: ChargeRecordComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
