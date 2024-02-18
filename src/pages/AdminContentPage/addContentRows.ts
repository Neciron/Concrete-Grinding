import { $t } from '@/scripts/$t';
import { addInputHandler } from '@/scripts/validation';
import { checkInput } from '@/scripts/validation';
import { RouteName } from '@/types';
import { Routes } from '@/router';
import { show } from '@/utils';
import { toast } from '@/components/toast';
import { TranslateManager } from '@/classes/TranslateManager';
import { validationRules } from '@/scripts/validation';

interface ContentFormElement extends HTMLFormElement {
  readonly key: HTMLInputElement;
  readonly value: HTMLInputElement;
}

enum Attribute {
  Cancel = 'cancel',
  Edit = 'edit',
  Remove = 'remove',
  Save = 'save',
}

const keyValidationRules = [
  validationRules.required,
  validationRules.noWhitespace,
  validationRules.maxLength(50),
  validationRules.noCyrillic,
  validationRules.onlyLowerCaseAndUnderscore,
];

const valueValidationRules = [validationRules.required];

const onListClick = (event: Event): void => {
  const target = event.target as Element;
  const action = target.getAttribute('data-action') ?? target.parentElement?.getAttribute('data-action');
  const container = target.closest('.content-edit-form__buttons');
  if (!container) {
    return;
  }
  if (action === Attribute.Remove) {
    const form = target.closest('form') as ContentFormElement|null;
    if (!form) {
      return;
    }
    const translateManager = new TranslateManager({ translations: window.translations, route: Routes[RouteName.AdminContent] });
    translateManager.removeTranslation(form.key.defaultValue).then((result) => {
      if (result) {
        const liElement = form.closest('li');
        liElement?.remove();
        toast.success($t('app_notification_translation_removed'));
      } else {
        show.error($t('app_application_error'));
      }
    }).catch((error) => {
      show.error($t('app_application_error'));
    });
    return;
  }
  if (action === Attribute.Edit) {
    const form = target.closest('form') as ContentFormElement|null;
    if (!form) {
      return;
    }
    form.key.readOnly = false;
    form.value.readOnly = false;
    container.classList.add('content-edit-form__buttons_edit');
    return;
  }
  if (action === Attribute.Cancel) {
    const form = target.closest('form') as ContentFormElement|null;
    if (!form) {
      return;
    }
    form.key.value = form.key.defaultValue;
    form.value.value = form.value.defaultValue;
    form.key.readOnly = true;
    form.value.readOnly = true;
    container.classList.remove('content-edit-form__buttons_edit');
    return;
  }
  if (action === Attribute.Save) {
    const form = target.closest('form') as ContentFormElement|null;
    if (!form) {
      return;
    }
    const keyIsValid = checkInput(form.key, keyValidationRules);
    const valueIsValid = checkInput(form.value, valueValidationRules);
    if (!keyIsValid || !valueIsValid) {
      return;
    }
    const translateManager = new TranslateManager({ translations: window.translations, route: Routes[RouteName.AdminContent] });
    translateManager.saveTranslation(form.key.value.trim(), form.value.value.trim()).then((result) => {
      if (result) {
        form.key.defaultValue = form.key.value.trim();
        form.value.defaultValue = form.value.value.trim();
        form.key.readOnly = true;
        form.value.readOnly = true;
        container.classList.remove('content-edit-form__buttons_edit');
      } else {
        show.error($t('app_application_error'));
      }
    }).catch((error) => {
      show.error($t('app_application_error'));
    });
  }
};

export const addContentRows = (translations: Translations): void => {
  const template = document.getElementById('admin-content-page-row-template') as HTMLTemplateElement|null;
  const list = document.getElementById('admin-content-page-list');
  if (!template || !list) {
    console.error('Template or list not found');
    return;
  }
  const addRowButton = document.getElementById('admin-content-page-add-row') as HTMLButtonElement|null;
  if (!addRowButton) {
    console.error('Add row button not found');
    return;
  }
  addRowButton.addEventListener('click', () => {
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const form = clone.querySelector('form') as ContentFormElement;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
    addInputHandler(form.key, keyValidationRules);
    addInputHandler(form.value, valueValidationRules);
    const container = form.querySelector('.content-edit-form__buttons');
    container?.classList.add('content-edit-form__buttons_edit');
    list.prepend(clone);
    const translateManager = new TranslateManager({ translations: window.translations, route: Routes[RouteName.AdminContent] });
    translateManager.translatePage();
  });
  list.addEventListener('click', onListClick);
  Object.keys(translations).forEach((key) => {
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const form = clone.querySelector('form') as ContentFormElement;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
    addInputHandler(form.key, keyValidationRules);
    addInputHandler(form.value, valueValidationRules);
    form.key.defaultValue = key;
    form.value.defaultValue = translations[key] ?? '';
    form.key.readOnly = true;
    form.value.readOnly = true;
    list.appendChild(clone);
  });
};
