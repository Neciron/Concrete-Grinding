import { show } from '@/utils';
import { validateInput } from './validateInput';

export const addInputHandler = (input: HTMLInputElement, rules: ValidationRule[]): void => {
  const errorSpan = input.parentElement?.querySelector('span');
  if (!errorSpan) {
    show.error('Інпут не має спорідненого span елементу!');
    return;
  }
  input.addEventListener('focus', () => {
    errorSpan.textContent = '';
  });
  input.addEventListener('blur', () => {
    const errorMessage = validateInput([input.value.trim()], rules);
    errorSpan.textContent = errorMessage ? errorMessage : '';
  });
  input.addEventListener('input', () => {
    errorSpan.textContent = '';
  });
};
