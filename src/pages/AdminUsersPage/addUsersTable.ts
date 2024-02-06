import { $t } from '@/scripts/$t';
import { apiUserInternal } from '@/api';
import getUsersDataTable from './UsersDataTable.pug';
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
}

interface TableRow {
  [TableColumn.Actions]: Row;
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
      [TableColumn.Actions]: {
        dataTitle: $t('app_edit'),
        value: '',
      },
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
