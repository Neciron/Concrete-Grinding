import { child } from 'firebase/database';
import { DBTable } from './DBTable';
import type { DBUser } from '@/types';
import type { FirebaseError } from 'firebase/app';
import { get } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { ref } from 'firebase/database';
import { toast } from '../toast';
import type { User } from 'firebase/auth';

export const checkUserRole = async (user: User): Promise<boolean> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `${DBTable.Users}/${user.uid}`)).catch((error: FirebaseError) => {
    toast.error(`${error.code}: ${error.message}`);
    console.error(error);
    return null;
  });
  console.log('snapshot');
  console.log(snapshot);

  if (!snapshot || !snapshot.exists()) {
    console.error('User table not found');
    toast.error('User table not found');
    return false;
  }
  const dbUser = snapshot.val() as DBUser;
  console.log('dbUser');
  console.log(dbUser);

  return dbUser.role === 'admin' || dbUser.role === 'moderator';
}