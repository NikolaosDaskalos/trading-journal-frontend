import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UiModule, UiService } from 'ui';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { UserService } from './user.service';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'delete',
    component: DeleteAccountComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [DeleteAccountComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    UiModule,
    RouterModule.forChild(routes),
  ],
  providers: [UiService, UserService],
})
export class UserModule {}
