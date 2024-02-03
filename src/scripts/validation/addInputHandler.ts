import { toast } from '../toast';
import { validateInput } from './validateInput';

export const addInputHandler = (input: HTMLInputElement, rules: ValidationRule[]): void => {
  const errorSpan = input.parentElement?.querySelector('span');
  if (!errorSpan) {
    toast.error('Error: Input does not have a sibling span element');
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
