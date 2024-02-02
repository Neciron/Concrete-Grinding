import { firebaseConfig } from '@/scripts/dbConfig';
import type { FirebaseError } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from '@/scripts/toast';
import { validateInput } from '@/scripts/validation';
import { validationRules } from '@/scripts/validation';

interface SignInFormElement extends HTMLFormElement {
  readonly email: HTMLInputElement;
  readonly password: HTMLInputElement;
}

const emailValidationRules = [
  validationRules.required,
  validationRules.noWhitespace,
  validationRules.maxLength(255),
  validationRules.noCyrillic,
  validationRules.email,
];

const passwordValidationRules = [
  validationRules.required,
  validationRules.noWhitespace,
  validationRules.minLength(8),
  validationRules.maxLength(255),
  validationRules.noCyrillic,
  validationRules.minOneSpecial,
  validationRules.minOneNumeric,
  validationRules.minOneUppercase,
  validationRules.minOneLowercase,
];

const signIn = async (email: string, password: string): Promise<boolean> => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const user = await signInWithEmailAndPassword(auth, email, password).catch((error: FirebaseError) => {
    toast.error(`Error: ${error.code} - ${error.message}`);
    return null;
  });
  if (!user) {
    return false;
  }
  return true;
}

const addInputHandler = (input: HTMLInputElement, rules: ValidationRule[]): void => {
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
}

const checkInput = (input: HTMLInputElement, rules: ValidationRule[]): boolean => {
  const errorSpan = input.parentElement?.querySelector('span');
  if (!errorSpan) {
    toast.error('Error: Input does not have a sibling span element');
    return false;
  }
  const errorMessage = validateInput([input.value.trim()], rules);
  errorSpan.textContent = errorMessage ? errorMessage : '';
  return !errorMessage;
}

const onFormSubmit = (event: Event): void => {
  event.preventDefault();
  const form = event.target as SignInFormElement;
  const actionButton: HTMLButtonElement|null = form.querySelector('button[type="submit"]');
  if (!actionButton) {
    toast.error('Error: Form does not have a submit button');
    return;
  }
  actionButton.disabled = true;
  const emailIsValid = checkInput(form.email, emailValidationRules);
  const passwordIsValid = checkInput(form.password, passwordValidationRules);
  if (!emailIsValid || !passwordIsValid) {
    actionButton.disabled = false;
    return;
  }
  signIn(form.email.value, form.password.value).then((result) => {
    console.log('result');
    console.log(result);
    if (result) {
      form.reset();
    }
    actionButton.disabled = false;
  }).catch((error) => {
    actionButton.disabled = false;
  });
}

export const addSignInFormHandler = (): void => {
  const form = document.getElementById('sign-in-form') as SignInFormElement;
  addInputHandler(form.email, emailValidationRules);
  addInputHandler(form.password, passwordValidationRules);
  form.addEventListener('submit', onFormSubmit);
}