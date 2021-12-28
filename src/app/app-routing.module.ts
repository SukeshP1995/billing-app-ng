import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { BillFormComponent } from './bill-form/bill-form.component';
import { ReceiptComponent } from './receipt/receipt.component';

const routes: Routes = [
  { path: '', component: BillFormComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'receipt', component: ReceiptComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
