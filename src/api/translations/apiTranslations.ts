import { child } from '@firebase/database';
import type { FirebaseError } from '@firebase/app';
import { get } from '@firebase/database';
import { getDatabase } from '@firebase/database';
import { ref } from '@firebase/database';
import { set } from '@firebase/database';
import { show } from '@/utils';

const TABLE_NAME = 'translations';

const getTranslations = async (): Promise<Translations> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, TABLE_NAME)).catch((error) => {
    console.error(error);
    return null;
  });
  if (!snapshot || !snapshot.exists()) {
    show.error('Таблицю з перекладами не знайдено!');
    return {};
  }
  const translations = snapshot.val() as Record<string, string>;
  return translations;
};

const saveTranslation = async (key: string, value: string): Promise<boolean> => {
  const dbRef = ref(getDatabase());
  const result = await set(child(dbRef, `${TABLE_NAME}/${key}`), value).catch((error: FirebaseError) => {
    show.error(`Помилка збереження перекладу! ${error.code}: ${error.message}`);
    console.error();
    return null;
  });
  return result !== null;
};

const removeTranslation = async (key: string): Promise<boolean> => {
  const dbRef = ref(getDatabase());
  const result = await set(child(dbRef, `${TABLE_NAME}/${key}`), null).catch((error: FirebaseError) => {
    show.error(`Помилка видалення перекладу! ${error.code}: ${error.message}`);
    return null;
  });
  return result !== null;
};

export const apiTranslations = {
  getTranslations,
  saveTranslation,
  removeTranslation,
};
