import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import * as moment from 'moment';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;

    if (!date) {
      return null;
    }
    const isValidFormat = moment(date, 'YYYY-MM-DD', true).isValid();
    const isNowOrPast = moment(date, 'YYYY-MM-DD', true).isSameOrBefore(
      moment(),
      'day'
    );

    if (!isValidFormat || !isNowOrPast) {
      return { date: true };
    }

    return null;
  };
}

export function postiveNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const someNumber: number = control.value;

    if (someNumber < 0) {
      return { positiveNumber: true };
    } else {
      return null;
    }
  };
}

export function formDatesValidation(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const buyDate: Date = control.get('buyDate')?.value;

    const sellDate: Date = control.get('sellDate')?.value;

    if (buyDate && sellDate) {
      return moment(buyDate).isSameOrBefore(sellDate, 'day')
        ? null
        : { comparingDates: true };
    }
    return null;
  };
}

export function formQuantityValidation() {
  return (control: AbstractControl): ValidationErrors | null => {
    const buyQuantity: number = control.get('buyQuantity')?.value;
    const sellQuantity: number = control.get('sellQuantity')?.value;

    if (buyQuantity && sellQuantity) {
      return buyQuantity >= sellQuantity ? null : { wrongQuantities: true };
    }

    return null;
  };
}
