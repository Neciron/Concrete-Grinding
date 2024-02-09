import { child } from '@firebase/database';
import { firebaseConfig } from '@/database';
import type { FirebaseError } from '@firebase/app';
import { getDatabase } from '@firebase/database';
import { initializeApp } from '@firebase/app';
import { ref } from '@firebase/database';
import { set } from '@firebase/database';
import { show } from '@/utils';
import { v4 as uuidv4 } from 'uuid';
import type { WorkType } from '@/types';

const TABLE_NAME = 'applications';

export interface ApplicationPostDto {
  contact_name: string;
  contact_phone: string;
  location: string;
  work_type: WorkType;
}

const saveApplication = async (value: ApplicationPostDto): Promise<boolean> => {
  const app = initializeApp(firebaseConfig);
  const id = uuidv4();
  const dbRef = ref(getDatabase());
  const result = await set(child(dbRef, `${TABLE_NAME}/${id}`), value).catch((error: FirebaseError) => {
    show.error(`Помилка збереження заявки! ${error.code}: ${error.message}`);
    console.error();
    return null;
  });
  return result !== null;
};


export const apiApplications = {
  saveApplication,
};
