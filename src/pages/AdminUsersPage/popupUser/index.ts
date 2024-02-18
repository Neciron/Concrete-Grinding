import { $t } from '@/scripts/$t';
import { apiUserInternal } from '@/api';
import getUserEditPopup from './PopupUser.pug';
import type { IUserInternal } from '@/types';
import { PopupUser } from '@/classes/PopupUser';
import { show } from '@/utils';
import { UserInternalRole } from '@/types';

interface RoleOption {
  readonly optionText: string;
  readonly value: string;
}

interface UserEditPopupOptions {
  readonly heading: string;
  readonly userIdLabelText: string;
  readonly userIdInputPlaceholder: string;
  readonly firstNameLabelText: string;
  readonly firstNameInputPlaceholder: string;
  readonly user: {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly role: string;
  };
  readonly lastNameLabelText: string;
  readonly lastNameInputPlaceholder: string;
  readonly roleLabelText: string;
  readonly roles: readonly RoleOption[];
  readonly buttonSaveText: string;
  readonly buttonCancelText: string;
}

const getRolesOptions = (): readonly RoleOption[] => {
  return [
    {
      optionText: $t('app_role_admin'),
      value: UserInternalRole.Admin,
    },
    {
      optionText: $t('app_role_moderator'),
      value: UserInternalRole.Moderator,
    },
  ];
};

export const onActionEdit = async (userId: string): Promise<IUserInternal|null> => {
  const userInternal = await apiUserInternal.getUserInternalById(userId).catch(() => {
    return null;
  });
  if (!userInternal) {
    show.error(`Користувача з id ${userId} не знайдено`);
    return null;
  }
  const options: UserEditPopupOptions = {
    userIdInputPlaceholder: $t('app_enter_id'),
    userIdLabelText: $t('app_id'),
    heading: $t('app_edit_user'),
    firstNameLabelText: $t('app_first_name'),
    firstNameInputPlaceholder: $t('app_enter_first_name'),
    user: {
      id: userInternal.id,
      firstName: userInternal.firstName,
      lastName: userInternal.lastName,
      role: userInternal.role,
    },
    lastNameLabelText: $t('app_last_name'),
    lastNameInputPlaceholder: $t('app_enter_last_name'),
    roleLabelText: $t('app_role'),
    roles: getRolesOptions(),
    buttonSaveText: $t('app_action_save'),
    buttonCancelText: $t('app_action_cancel'),
  };
  const renderedTemplate = getUserEditPopup(options);
  const template = document.createElement('template');
  template.innerHTML = renderedTemplate;
  const popup = new PopupUser({
    renderedTemplate: template.content,
  });
  return popup.getResult();
};

export const onActionAdd = async (): Promise<IUserInternal|null> => {
  const options: UserEditPopupOptions = {
    heading: $t('app_add_user'),
    userIdInputPlaceholder: $t('app_enter_id'),
    userIdLabelText: $t('app_id'),
    firstNameLabelText: $t('app_first_name'),
    firstNameInputPlaceholder: $t('app_enter_first_name'),
    user: {
      id: '',
      firstName: '',
      lastName: '',
      role: '',
    },
    lastNameLabelText: $t('app_last_name'),
    lastNameInputPlaceholder: $t('app_enter_last_name'),
    roleLabelText: $t('app_role'),
    roles: getRolesOptions(),
    buttonSaveText: $t('app_action_save'),
    buttonCancelText: $t('app_action_cancel'),
  };
  const renderedTemplate = getUserEditPopup(options);
  const template = document.createElement('template');
  template.innerHTML = renderedTemplate;
  const popup = new PopupUser({
    renderedTemplate: template.content,
  });
  return popup.getResult();
};
