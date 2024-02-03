import { show } from '@/utils';
import { validateInput } from './validateInput';

export const checkInput = (input: HTMLInputElement, rules: ValidationRule[]): boolean => {
  const errorSpan = input.parentElement?.querySelector('span');
  if (!errorSpan) {
    show.error('Інпут не має спорідненого span елементу!');
    return false;
  }
  const errorMessage = validateInput([input.value.trim()], rules);
  errorSpan.textContent = errorMessage ? errorMessage : '';
  return !errorMessage;
};
