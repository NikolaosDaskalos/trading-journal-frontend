import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription, take, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserDTO } from 'shared';
import { UiService } from 'ui';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private user: User | null = null;
  isEditable = false;
  userSub: Subscription | null = null;
  getUserSub: Subscription | null = null;
  updateUserSub: Subscription | null = null;
  isLoading = false;
  alerts = this.uiService.alerts;

  constructor(
    private userService: UserService,
    private uiService: UiService,
    private fb: FormBuilder
  ) {
    this.form = this.mapToForm({} as UserDTO);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userSub = this.userService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });

    if (this.user) {
      this.getUserSub = this.userService.getUser(this.user.username).subscribe({
        next: (resp) => {
          this.form = this.mapToForm(resp);
          this.form.disable();
          this.isLoading = false;
        },
      });
    }
  }

  hasErrors(controlName: string) {
    if (this.form.disabled || this.form.get(controlName)?.value === '') {
      return '';
    } else if (this.form?.get(controlName)?.errors !== null) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  onEdit() {
    this.form.enable();
    this.form.get('username')?.disable();
  }

  onCancel() {
    this.form.disable();
  }

  onUpdate() {
    if (this.form.invalid) {
      this.uiService.newAlert({
        type: 'warning',
        text: 'your settings has invalid values please correct them',
      });
      return;
    }

    this.isLoading = true;

    this.updateUserSub = this.userService
      .updateUser(this.form.getRawValue())
      .subscribe({
        next: (resp) => {
          this.form = this.mapToForm(resp);
          this.form.disable();
          this.isLoading = false;
          this.uiService.newAlert({
            type: 'success',
            text: `${resp.name} your settings updated successfully!`,
          });
        },
        error: (err) => (this.isLoading = false),
      });
  }

  onAlertDismiss(index: number) {
    this.uiService.alertDismiss(index);
  }

  showErrors(controlName: string) {
    const errors = this.form?.get(controlName)?.errors;

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
    } else {
      return null;
    }
  }

  private mapToForm(dto: UserDTO) {
    return this.fb.group({
      name: [dto.name ?? '', Validators.required],
      lastname: [dto.lastname ?? '', Validators.required],
      age: [dto.age ?? '', [Validators.required, Validators.min(18)]],
      email: [dto.email ?? '', [Validators.required, Validators.email]],
      username: [
        dto.username ?? '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(13),
        ],
      ],
      password: [
        dto.password ?? '',
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

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.getUserSub?.unsubscribe();
    this.updateUserSub?.unsubscribe();
  }
}
