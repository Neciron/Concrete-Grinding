import { $t } from '@/scripts/$t';
import { apiUserInternal } from '@/api';
import getUsersDataTable from './UsersDataTable.pug';
import { onActionAdd } from '../popupUser';
import { onActionEdit } from '../popupUser';
import { RouteName } from '@/types';
import { Routes } from '@/router';
import { show } from '@/utils';
import { toast } from '@/components/toast';
import { TranslateManager } from '@/classes/TranslateManager';
import type { UserInternal } from '@/classes/UserInternal';
import { UserInternalRole } from '@/types';

enum TableColumn {
  Actions = 'actions',
  FirstName = 'firstName',
  Id = 'id',
  LastName = 'lastName',
  Role = 'role',
}

interface Row {
  readonly value: string;
  readonly dataTitle: string;
  readonly icon?: string;
}

interface TableRow {
  [TableColumn.Actions]: Row[];
  [TableColumn.FirstName]: Row;
  [TableColumn.Id]: Row;
  [TableColumn.LastName]: Row;
  [TableColumn.Role]: Row;
}

const getTableHeaders = (): readonly TableHeader[] => {
  return [
    {
      title: $t('app_id'),
      key: TableColumn.Id,
    },
    {
      title: $t('app_first_name'),
      key: TableColumn.FirstName,
    },
    {
      title: $t('app_last_name'),
      key: TableColumn.LastName,
    },
    {
      title: $t('app_role'),
      key: TableColumn.Role,
    },
    {
      title: $t('app_action_add'),
      key: TableColumn.Actions,
    },
  ];
};

enum Action {
  Add = 'add',
  Edit = 'edit',
  Remove = 'remove',
}

const getTableRows = (users: readonly UserInternal[]): readonly TableRow[] => {
  return users.map((user) => {
    return {
      [TableColumn.Id]: {
        dataTitle: $t('app_id'),
        value: user.id,
      },
      [TableColumn.FirstName]: {
        dataTitle: $t('app_first_name'),
        value: user.firstName,
      },
      [TableColumn.LastName]: {
        dataTitle: $t('app_last_name'),
        value: user.lastName,
      },
      [TableColumn.Role]: {
        dataTitle: $t('app_role'),
        value: user.role === UserInternalRole.Admin ? $t('app_role_admin') : $t('app_role_moderator'),
      },
      [TableColumn.Actions]: [
        {
          dataTitle: $t('app_edit'),
          value: Action.Edit,
          icon: 'fa-solid fa-pencil',
        },
        {
          dataTitle: $t('app_remove'),
          value: Action.Remove,
          icon: 'fa-solid fa-trash',
        },
      ],
    };
  });
};

export const addUsersTable = async (): Promise<void> => {
  const container = document.querySelector('.admin-users-page__content');
  if (!container) {
    return;
  }
  const usersInternal = await apiUserInternal.getAllUsersInternal();
  const template = document.createElement('template');
  template.innerHTML = getUsersDataTable({
    tableHeaders: getTableHeaders(),
    tableRows: getTableRows(usersInternal),
  });
  const templateContent = template.content;
  container.appendChild(templateContent);
};

const onTableClick = (event: Event): void => {
  const target = event.target as HTMLElement;
  const action = target.getAttribute('data-action') ?? target.parentElement?.getAttribute('data-action');
  const userId = target.getAttribute('data-user-id') ?? target.parentElement?.getAttribute('data-user-id');
  if (action === Action.Add) {
    onActionAdd().then((result) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      saveUser(result, true).then(() => {
        toast.success('Користувача додано');
      }).catch(() => {
        show.error('Помилка при оновлені даних користувача');
      });
    }).catch(() => {
      show.error('Помилка при відкритті попапу');
    });
  }
  if (action === Action.Edit && userId) {
    onActionEdit(userId).then((result) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      saveUser(result, false).then(() => {
        toast.success('Зміни збережено');
      }).catch(() => {
        show.error('Помилка при оновлені даних користувача');
      });
    }).catch(() => {
      show.error('Помилка при відкритті попапу');
    });
  }
  if (action === Action.Remove && userId) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    removeUser(userId).then(() => {
      toast.success('Користувача видалено');
    }).catch(() => {
      show.error('Помилка при видаленні користувача');
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

// eslint-disable-next-line func-style
async function saveUser(user: UserInternal|null, isNewUser: boolean): Promise<void> {
  if (!user) {
    return;
  }
  const userSaved = await apiUserInternal.saveUserInternal(user, isNewUser).catch(() => {
    show.error('Помилка при оновлені даних користувача');
    return null;
  });
  if (!userSaved) {
    show.error('Помилка при оновлені даних користувача');
    return;
  }
  const table = document.getElementById('users-table');
  if (!table) {
    show.error('Контейнер для таблиці користувачів не знайдено');
    return;
  }
  table.remove();
  await addUsersTable().catch(() => {
    show.error($t('app_application_error'));
  });
  addUsersTableActionsHandlers();
  const translateManager = new TranslateManager({ translations: {}, route: Routes[RouteName.AdminUsers] });
  await translateManager.init();
  translateManager.translatePage();
}

// eslint-disable-next-line func-style
async function removeUser(userId: string): Promise<void> {
  const userRemoved = await apiUserInternal.removeUserInternal(userId).catch(() => {
    return null;
  });
  if (userRemoved === null) {
    show.error('Помилка при оновлені даних користувача');
    return;
  }
  const table = document.getElementById('users-table');
  if (!table) {
    show.error('Контейнер для таблиці користувачів не знайдено');
    return;
  }
  table.remove();
  await addUsersTable().catch(() => {
    show.error($t('app_application_error'));
  });
  addUsersTableActionsHandlers();
  const translateManager = new TranslateManager({ translations: {}, route: Routes[RouteName.AdminUsers] });
  await translateManager.init();
  translateManager.translatePage();
}
