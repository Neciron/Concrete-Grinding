import { firebaseConfig } from '@/database';
import { getAuth } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { onAuthStateChanged } from '@firebase/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { signOut } from '@firebase/auth';
import type { User } from '@firebase/auth';

const getUser = (): Promise<User|null> => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  return new Promise<User|null>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};

const signOutFirebase = async (): Promise<boolean> => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const result = await signOut(auth).catch(() => {
    return null;
  });
  return result !== null;
};

const signIn = async (email: string, password: string): Promise<boolean> => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const user = await signInWithEmailAndPassword(auth, email, password).catch(() => {
    return null;
  });
  if (!user) {
    return false;
  }
  return true;
};

export const apiUserFirebase = {
  getUser,
  signOutFirebase,
  signIn,
};
