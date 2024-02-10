import { child } from '@firebase/database';
import type { FirebaseError } from '@firebase/app';
import { get } from '@firebase/database';
import { getDatabase } from '@firebase/database';
import { getUserInternalRoleFromValue } from '@/types';
import { ref } from '@firebase/database';
import { set } from '@firebase/database';
import { show } from '@/utils';
import { toast } from '@/components/toast';
import type { User } from '@firebase/auth';
import { UserInternal } from '@/classes/UserInternal';
import { UserInternalRole } from '@/types';

const TABLE_NAME = 'users';

interface UserInternalDtoGet {
  readonly first_name?: string;
  readonly last_name?: string;
  readonly role?: string;
}

const getUser = async (user: User): Promise<UserInternal|null> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `${TABLE_NAME}/${user.uid}`)).catch((error: FirebaseError) => {
    toast.error(`${error.code}: ${error.message}`);
    console.error(error);
  });
  if (!snapshot || !snapshot.exists()) {
    return null;
  }
  const dbUser = snapshot.val() as UserInternalDtoGet;
  return new UserInternal({
    id: user.uid,
    firstName: dbUser.first_name ?? 'Unknown',
    lastName: dbUser.last_name ?? 'Unknown',
    role: getUserInternalRoleFromValue(dbUser.role) ?? UserInternalRole.Unknown,
  });
};

const getAllUsersInternal = async (): Promise<readonly UserInternal[]> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, TABLE_NAME)).catch((error: FirebaseError) => {
    toast.error(`${error.code}: ${error.message}`);
    console.error(error);
  });
  if (!snapshot) {
    return [];
  }
  const usersInternal: UserInternal[] = [];
  snapshot.forEach((childSnapshot) => {
    const dbUser = childSnapshot.val() as UserInternalDtoGet;
    usersInternal.push(new UserInternal({
      id: childSnapshot.key,
      firstName: dbUser.first_name ?? 'Unknown',
      lastName: dbUser.last_name ?? 'Unknown',
      role: getUserInternalRoleFromValue(dbUser.role) ?? UserInternalRole.Unknown,
    }));
  });
  return usersInternal;
};

const getUserInternalById = async (userId: string): Promise<UserInternal|null> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `${TABLE_NAME}/${userId}`)).catch((error: FirebaseError) => {
    toast.error(`${error.code}: ${error.message}`);
    console.error(error);
  });
  if (!snapshot || !snapshot.exists()) {
    return null;
  }
  const dbUser = snapshot.val() as UserInternalDtoGet;
  return new UserInternal({
    id: userId,
    firstName: dbUser.first_name ?? 'Unknown',
    lastName: dbUser.last_name ?? 'Unknown',
    role: getUserInternalRoleFromValue(dbUser.role) ?? UserInternalRole.Unknown,
  });
};

const saveUserInternal = async (user: UserInternal, isNewUser: boolean): Promise<UserInternal|null> => {
  const dbRef = ref(getDatabase());
  if (!isNewUser) {
    const snapshot = await get(child(dbRef, `${TABLE_NAME}/${user.id}`)).catch((error: FirebaseError) => {
      toast.error(`${error.code}: ${error.message}`);
      console.error(error);
    });
    if (!snapshot || !snapshot.exists()) {
      return null;
    }
  }
  const result = await set(child(dbRef, `${TABLE_NAME}/${user.id}`), {
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role,
  }).catch((error: FirebaseError) => {
    show.error(`Помилка збереження користувача! ${error.code}: ${error.message}`);
    console.error();
    return null;
  });
  if (result === null) {
    return null;
  }
  return new UserInternal({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
};

const removeUserInternal = async (userId: string): Promise<boolean> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `${TABLE_NAME}/${userId}`)).catch((error: FirebaseError) => {
    toast.error(`${error.code}: ${error.message}`);
    console.error(error);
  });
  if (!snapshot || !snapshot.exists()) {
    return false;
  }
  const result = await set(child(dbRef, `${TABLE_NAME}/${userId}`), {}).catch((error: FirebaseError) => {
    show.error(`Помилка видалення користувача! ${error.code}: ${error.message}`);
    console.error();
    return null;
  });
  if (result === null) {
    return false;
  }
  return true;
};

export const apiUserInternal = {
  getUser,
  getAllUsersInternal,
  getUserInternalById,
  saveUserInternal,
  removeUserInternal,
};
