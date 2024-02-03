import { child } from '@firebase/database';
import { get } from '@firebase/database';
import { getDatabase } from '@firebase/database';
import { getUserInternalRoleFromValue } from '@/types';
import { ref } from '@firebase/database';
import type { User } from '@firebase/auth';
import { UserInternal } from '@/classes/UserInternal';
import { UserInternalRole } from '@/types';
import { utils } from '@/scripts/utils';

const TABLE_NAME = 'users';

interface UserInternalDtoGet {
  readonly first_name?: string;
  readonly last_name?: string;
  readonly role?: string;
}

const getUser = async (user: User): Promise<UserInternal|null> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `${TABLE_NAME}/${user.uid}`)).catch(utils.onFireBaseError);
  if (!snapshot || !snapshot.exists()) {
    return null;
  }
  const dbUser = snapshot.val() as UserInternalDtoGet;
  return new UserInternal({
    firstName: dbUser.first_name ?? 'Unknown',
    lastName: dbUser.last_name ?? 'Unknown',
    role: getUserInternalRoleFromValue(dbUser.role) ?? UserInternalRole.Unknown,
  });
};

export const apiUserInternal = {
  getUser,
};
