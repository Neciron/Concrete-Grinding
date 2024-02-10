import type { IPopupUser } from '@/types';
import type { IPopupUserProps } from '@/types';
import type { IUserInternal } from '@/types';
import { Popup } from './Popup';
import { UserInternal } from './UserInternal';
import type { UserInternalRole } from '@/types';
import { checkInput, validationRules } from '@/scripts/validation';

interface UserFormElement extends HTMLFormElement {
  readonly 'user-id': HTMLInputElement;
  readonly 'first-name': HTMLInputElement;
  readonly 'last-name': HTMLInputElement;
  readonly 'user-role': HTMLSelectElement;
}

export class PopupUser implements IPopupUser {
  public readonly renderedTemplate;

  public constructor(props: IPopupUserProps) {
    this.renderedTemplate = props.renderedTemplate;
  }
  public async getResult(): Promise<IUserInternal|null> {
    return new Promise((resolve) => {
      const popup = new Popup({
        renderedTemplate: this.renderedTemplate,
        onClose: (): void => {
          resolve(null);
        },
        onConfirm: (event): void => {
          const form = event.target as UserFormElement;
          const formIsValid = this.validateForm(form);
          if (!formIsValid) {
            return;
          }
          const user = new UserInternal({
            id: form['user-id'].value,
            firstName: form['first-name'].value,
            lastName: form['last-name'].value,
            role: form['user-role'].value as UserInternalRole,
          });
          resolve(user);
          popup.hide();
        },
      });
      popup.show();
    });
  }

  private validateForm(form: UserFormElement): boolean {
    const userIdIsValid = checkInput(form['user-id'], [validationRules.required, validationRules.maxLength(255)]);
    const firstNameIsValid = checkInput(form['first-name'], [validationRules.required, validationRules.maxLength(255)]);
    const lastNameIsValid = checkInput(form['last-name'], [validationRules.required, validationRules.maxLength(255)]);
    const userRoleIsValid = checkInput(form['user-role'], [validationRules.required]);
    return userIdIsValid && firstNameIsValid && lastNameIsValid && userRoleIsValid;
  }
}
