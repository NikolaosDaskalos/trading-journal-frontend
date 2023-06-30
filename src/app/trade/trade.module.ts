import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeService } from './trade.service';
import { AllTradesComponent } from './all-trades/all-trades.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UiModule } from 'ui';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: '', component: AllTradesComponent, canActivate: [authGuard] },
];

@NgModule({
  declarations: [AllTradesComponent, DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    RouterModule.forChild(routes),
  ],
  providers: [TradeService],
})
export class TradeModule {}
