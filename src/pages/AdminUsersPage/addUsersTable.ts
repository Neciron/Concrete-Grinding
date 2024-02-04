import { $t } from '@/scripts/$t';
import { apiUserInternal } from '@/api';
import getCustomTable from './CustomTable.pug';
import type { UserInternal } from '@/classes/UserInternal';

enum TableColumn {
  Actions = 'actions',
  FirstName = 'firstName',
  Id = 'id',
  LastName = 'lastName',
  Role = 'role',
}

interface TableRow {
  [TableColumn.FirstName]: string;
  [TableColumn.Id]: string;
  [TableColumn.LastName]: string;
  [TableColumn.Role]: string;
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
      title: '',
      key: TableColumn.Actions,
    },
  ];
};

const getTableRows = (users: readonly UserInternal[]): readonly TableRow[] => {
  return users.map((user) => {
    return {
      [TableColumn.Id]: user.id,
      [TableColumn.FirstName]: user.firstName,
      [TableColumn.LastName]: user.lastName,
      [TableColumn.Role]: user.role,
    };
  });
};

export const addUsersTable = async (): Promise<void> => {
  const table = document.querySelector('.data-table');
  if (!table) {
    return;
  }
  const usersInternal = await apiUserInternal.getAllUsersInternal();
  table.innerHTML = getCustomTable({
    tableHeaders: getTableHeaders(),
    tableRows: getTableRows(usersInternal),
  });
};
