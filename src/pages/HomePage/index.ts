import { $t } from '@/scripts/$t';
import { addInputHandler } from '@/scripts/validation';
import { apiApplications } from '@/api';
import { checkInput } from '@/scripts/validation';
import getWorkTypeSelector from './WorkTypeSelector.pug';
import { RouteName } from '@/types';
import { Routes } from '@/router';
import { show } from '@/utils';
import { toast } from '@/components/toast';
import { TranslateManager } from '@/classes/TranslateManager';
import { validationRules } from '@/scripts/validation';
import { WorkType } from '@/types';

// eslint-disable-next-line no-debugger
debugger;
interface ApplicationFormElement extends HTMLFormElement {
  readonly 'name-input': HTMLInputElement;
  readonly 'phone-input': HTMLInputElement;
  readonly 'location-input': HTMLInputElement;
  readonly 'work-type-input': HTMLInputElement;
}

// Функція для обробки відправки форми
const nameValidationRules = [
  validationRules.required,
  validationRules.minLength(2),
  validationRules.maxLength(100),
  validationRules.onlyCyrillic,
];

const phoneValidationRules = [
  validationRules.required,
  validationRules.noWhitespace,
  validationRules.phone,
];

const locationValidationRules = [
  validationRules.required,
  validationRules.minLength(2),
  validationRules.maxLength(255),
  validationRules.onlyCyrillicOrDigits,
];

const workTypeValidationRules = [
  validationRules.required,
  validationRules.minLength(2),
  validationRules.maxLength(255),
  validationRules.onlyCyrillicOrDigits,
];

const onApplicationFormSubmit = (event: Event): void => {
  // eslint-disable-next-line no-debugger
  // debugger;
  event.preventDefault();
  const form = event.target as ApplicationFormElement;
  const actionButton: HTMLButtonElement|null = form.querySelector('button[type="submit"]');
  if (!actionButton) {
    show.error('Форма не має кнопки надсилання!');
    return;
  }
  actionButton.disabled = true;

  const nameIsValid = checkInput(form['name-input'], nameValidationRules);
  const phoneIsValid = checkInput(form['phone-input'], phoneValidationRules);
  const locationIsValid = checkInput(form['location-input'], locationValidationRules);
  const workTypeIsValid = checkInput(form['work-type-input'], workTypeValidationRules);
  console.log(form['name-input'].value);
  console.log(form['phone-input'].value);
  console.log(form['location-input'].value);
  console.log(form['work-type-input'].value);
  if (!nameIsValid || !phoneIsValid || !locationIsValid || !workTypeIsValid) {
    actionButton.disabled = false;
    return;
  }

  apiApplications.saveApplication({
    contact_name: form['name-input'].value,
    contact_phone: form['phone-input'].value,
    location: form['location-input'].value,
    work_type: form['work-type-input'].value as WorkType,
  }).then((result) => {
    if (result) {
      // eslint-disable-next-line no-debugger
      debugger;
      form.reset();
      toast.success($t('application_input_save'));
      console.log('Заявку успішно збережено');
    } else {
      toast.error($t('app_api_error_application_in'));
    }
    actionButton.disabled = false;
  }).catch((error) => {
    actionButton.disabled = false;
  });

};

interface WorkTypeSelectorItem {
  readonly value: WorkType;
  readonly optionText: string;
  readonly selected?: boolean;
}

interface WorkTypeSelector {
  readonly workTypeLabelText: string;
  readonly workTypes: readonly WorkTypeSelectorItem[];
}

export const addApplicationFormHandler = async (): Promise<void> => {
  const translateManager = new TranslateManager({ translations: {}, route: Routes[RouteName.Home] });
  await translateManager.init();
  // eslint-disable-next-line no-debugger
  debugger;
  const renderedTemplate = getWorkTypeSelector<WorkTypeSelector>({
    workTypeLabelText: 'Тип роботи',
    workTypes: [
      {
        optionText: 'Шліфування підлоги',
        value: WorkType.FloorGrinding,
      },
      {
        optionText: 'Шліфування стелі',
        value: WorkType.RoofGrinding,
        selected: true,
      },
    ],
  });
  const template = document.createElement('template');
  template.innerHTML = renderedTemplate;
  const container = document.getElementById('selector');
  if (!container) {
    return;
  }
  container.appendChild(template.content);
  const form = document.getElementById('application-form') as ApplicationFormElement;
  addInputHandler(form['name-input'], nameValidationRules);
  addInputHandler(form['phone-input'], phoneValidationRules);
  addInputHandler(form['location-input'], locationValidationRules);
  addInputHandler(form['work-type-input'], workTypeValidationRules);
  form.addEventListener('submit', onApplicationFormSubmit);
};

addApplicationFormHandler().catch((error) => {
  console.error(error);
  show.error($t('app_application_error'));
});
