import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import { UiModule, UiService } from 'ui';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'login', component: LoginComponent },

  { path: '', component: WelcomeComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    WelcomeComponent,
    PageNotFoundComponent,
    RegisterComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    RouterModule.forChild(routes),
  ],
  providers: [UiService],
})
export class PublicModule {}
