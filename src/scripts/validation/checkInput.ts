import { toast } from '../toast';
import { validateInput } from './validateInput';

export const checkInput = (input: HTMLInputElement, rules: ValidationRule[]): boolean => {
  const errorSpan = input.parentElement?.querySelector('span');
  if (!errorSpan) {
    toast.error('Error: Input does not have a sibling span element');
    return false;
  }
  const errorMessage = validateInput([input.value.trim()], rules);
  errorSpan.textContent = errorMessage ? errorMessage : '';
  return !errorMessage;
};
