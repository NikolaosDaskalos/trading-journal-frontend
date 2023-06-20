import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { UiService } from 'ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  isLoading = false;
  form: FormGroup;
  alerts = this.uiService.alerts;
  private loginSub: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(13),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*_-]).*$'
          ),
        ],
      ],
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.isLoading = true;

    this.loginSub = this.authService.login(this.form.value).subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.uiService.alerts.length = 0;
        this.router.navigate(['trades']);
      },
      error: (errorMessage) => {
        this.uiService.newAlert({
          type: 'danger',
          text: errorMessage,
        });

        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe;
    this.uiService.alerts.length = 0;
  }

  onAlertDismiss(index: number) {
    this.uiService.alertDismiss(index);
  }
}
