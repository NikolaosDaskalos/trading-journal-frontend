import { AbstractControl, ValidatorFn } from '@angular/forms';

export function matchValidator(source: string, target: string): ValidatorFn {
  return (control: AbstractControl) => {
    const sourceControl = control.get(source);
    const targetControl = control.get(target);

    if (sourceControl?.value !== targetControl?.value) {
      return { mismatch: true };
    } else {
      return null;
    }
  };
}
