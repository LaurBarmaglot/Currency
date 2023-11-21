import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

export function customRequired(control: AbstractControl): ValidationErrors | null {
  return Validators.required(control);
}

export function rateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rate = control.value as number;
    if (rate === 0) {
      return {zeroRate: true, message: 'Rate cannot be zero'};
    }
    if (rate < 0) {
      return {negativeRate: true, message: 'Rate cannot be negative'};
    }

    if (!/\d/.test(rate.toString())) {
      return {
        nonNumericRate: true,
        message: 'Rate must contain numeric values'
      };
    }
    return null;
  };
}
