import { show } from '@/utils';
import { validateInput } from './validateInput';

export const checkInput = (input: HTMLInputElement|HTMLSelectElement, rules: ValidationRule[]): boolean => {
  const parent = input.closest('.app-select') ?? input.closest('.app-input');
  const errorSpan = parent?.querySelector('span');
  if (!errorSpan) {
    show.error('Інпут не має спорідненого span елементу!');
    return false;
  }
  const errorMessage = validateInput([input.value.trim()], rules);
  errorSpan.textContent = errorMessage ? errorMessage : '';
  return !errorMessage;
};
