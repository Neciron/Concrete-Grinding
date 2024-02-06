import { $t } from '@/scripts/$t';
import { apiUserInternal } from '@/api';
import getUserEditPopup from './UserEditPopup.pug';
import { show } from '@/utils';
import { UserEditPopup } from '@/classes/UserEditPopup';
import { UserInternalRole } from '@/types';

enum Action {
  Add = 'Add',
  Edit = 'edit',
}

interface RoleOption {
  readonly optionText: string;
  readonly value: string;
}

interface UserEditPopupOptions {
  readonly firstNameLabelText: string;
  readonly firstNameInputPlaceholder: string;
  readonly user: {
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

const onActionEdit = async (userId: string): Promise<void> => {
  const userInternal = await apiUserInternal.getUserInternalById(userId).catch(() => {
    return null;
  });
  if (!userInternal) {
    show.error(`Користувача з id ${userId} не знайдено`);
    return;
  }
  const options: UserEditPopupOptions = {
    firstNameLabelText: $t('app_first_name'),
    firstNameInputPlaceholder: $t('app_enter_first_name'),
    user: {
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
  const popup = new UserEditPopup({
    userId,
    renderedTemplate: template.content,
  });
  popup.getEditResult().then((result) => {
    console.log('Result from getEditResult', result);
  }).catch(() => {
    console.error('Error');
  });
};

const onTableClick = (event: Event): void => {
  const target = event.target as HTMLElement;
  const action = target.getAttribute('data-action') ?? target.parentElement?.getAttribute('data-action');
  const userId = target.getAttribute('data-user-id') ?? target.parentElement?.getAttribute('data-user-id');
  console.log('action');
  console.log(action);
  if (action === Action.Add) {
    console.log('Add');
  }
  if (action === Action.Edit && userId) {
    onActionEdit(userId).catch(() => {
      show.error('Помилка при відкритті попапу');
    });
  }
};

export const addUsersTableActionsHandlers = (): void => {
  const table = document.getElementById('users-table');
  if (!table) {
    show.error('Таблицю користувачів не знайдено');
    return;
  }
  table.addEventListener('click', onTableClick);
};
