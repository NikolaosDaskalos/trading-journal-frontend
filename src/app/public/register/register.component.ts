import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthDTO, UserDTO } from 'shared';
import { UiService } from 'ui';
import { matchValidator } from './register-form.validators';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  private registerSub: Subscription | undefined;
  alerts = this.uiService.alerts;

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        age: ['', [Validators.required, Validators.min(18)]],
        email: ['', [Validators.required, Validators.email]],
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
        repeatPassword: ['', Validators.required],
      },
      { validators: matchValidator('password', 'repeatPassword') }
    );
  }

  ngOnInit(): void {
    // Triming the string values
    this.form.valueChanges.subscribe((value) => {
      for (const key in value) {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.registerSub = this.authService
      .register(this.formCopyExcludeRepeatPassword())
      .subscribe({
        next: (AuthDTO: AuthDTO) => {
          this.uiService.newAlert({
            type: 'success',
            text: 'You are registered sucessfully',
          });
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

  onAlertDismiss(index: number) {
    this.uiService.alertDismiss(index);
  }

  formCopyExcludeRepeatPassword(): UserDTO {
    const formValueCopy = { ...this.form.value };
    delete formValueCopy.repeatPassword;
    return formValueCopy;
  }

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe;
    this.uiService.alerts.length = 0;
  }

  controlError(controlName: string) {
    const control = this.form.get(controlName);

    if (control?.errors) {
      return control.errors;
    }
    return null;
  }

  hasErrors(controlName: string) {
    if (controlName === 'repeatPassword') {
      return (
        this.form.get(controlName)?.errors !== null ||
        this.form.errors?.['mismatch']
      );
    }
    return this.form.get(controlName)?.errors !== null;
  }

  showErrors(controlName: string) {
    const errors = this.form.get(controlName)?.errors;

    if (errors?.['required']) {
      return `required field`;
    } else if (errors?.['pattern']) {
      return `${controlName} must have at least one: uppercase letter, lowercase letter, number, sumbol`;
    } else if (errors?.['min']) {
      return `${controlName} must be ${errors?.['min'].min} and above`;
    } else if (errors?.['minlength']) {
      return `${controlName} must be longer than ${errors?.['minlength'].requiredLength} characters`;
    } else if (errors?.['maxlength']) {
      return `${controlName} must be shorter than ${errors?.['maxlength'].requiredLength} characters`;
    } else if (errors?.['email']) {
      return `${controlName} has wrong format`;
    } else if (
      controlName === 'repeatPassword' &&
      this.form.errors?.['mismatch']
    ) {
      return `password does not match`;
    } else {
      return null;
    }
  }
}
