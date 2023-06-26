import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UiModule, UiService } from 'ui';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { UserService } from './user.service';
import { authGuard } from '../auth/auth.guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'delete',
    component: DeleteAccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit',
    component: AccountSettingsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [DeleteAccountComponent, AccountSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    UiModule,
    RouterModule.forChild(routes),
  ],
  providers: [UiService, UserService],
})
export class UserModule {}
