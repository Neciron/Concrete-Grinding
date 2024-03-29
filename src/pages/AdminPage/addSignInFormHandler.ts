import { $t } from '@/scripts/$t';
import { addInputHandler } from '@/scripts/validation';
import { apiUserFirebase } from '@/api';
import { checkInput } from '@/scripts/validation';
import { navigate } from '@/router';
import { RouteName } from '@/types';
import { Routes } from '@/router';
import { show } from '@/utils';
import { toast } from '@/components/toast';
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

const onFormSubmit = (event: Event): void => {
  event.preventDefault();
  const form = event.target as SignInFormElement;
  const actionButton: HTMLButtonElement|null = form.querySelector('button[type="submit"]');
  if (!actionButton) {
    show.error('Форма не має кнопки надсилання!');
    return;
  }
  actionButton.disabled = true;
  const emailIsValid = checkInput(form.email, emailValidationRules);
  const passwordIsValid = checkInput(form.password, passwordValidationRules);
  if (!emailIsValid || !passwordIsValid) {
    actionButton.disabled = false;
    return;
  }
  apiUserFirebase.signIn(form.email.value.trim(), form.password.value.trim()).then((result) => {
    if (result) {
      form.reset();
      navigate(Routes[RouteName.AdminFeedbacks]);
    } else {
      toast.error($t('app_api_error_sign_in'));
    }
    actionButton.disabled = false;
  }).catch((error) => {
    actionButton.disabled = false;
  });
};

export const addSignInFormHandler = (): void => {
  const form = document.getElementById('sign-in-form') as SignInFormElement;
  addInputHandler(form.email, emailValidationRules);
  addInputHandler(form.password, passwordValidationRules);
  form.addEventListener('submit', onFormSubmit);
};
