import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceDetailsComponent } from './finance-details/finance-details.component'

const routes: Routes = [
  {
    path: "",
    component: FinanceDetailsComponent
  },
  {
    path: "finance-list",
    component: FinanceDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
