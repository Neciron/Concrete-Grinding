import { child } from 'firebase/database';
import { DBTable } from './DBTable';
import { get } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { ref } from 'firebase/database';
import type { RouteEntity } from './Route';

type Translations = Record<string, string>;

const getTranslations = async (): Promise<Translations> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, DBTable.Translations)).catch((error) => {
    console.error(error);
    return null;
  });
  if (!snapshot || !snapshot.exists()) {
    console.error('No translations available');
    return {};
  }
  const translations = snapshot.val() as Record<string, string>;  
  return translations;
}

enum DataAttributeName {
  Text = 'data-tr-text',
  Placeholder = 'data-tr-placeholder',
  FullYear = 'data-tr-full-year',
}

interface TranslateParams {
  translations: Translations;
  attributeName: DataAttributeName;
  element: Element;
}

const translate = (params: TranslateParams): void => {
  const key = params.element.getAttribute(params.attributeName);
  switch (params.attributeName) {
    case DataAttributeName.Text:
      params.element.textContent = params.translations[key ?? ''] ?? '--';
      break;
    case DataAttributeName.Placeholder:
      params.element.setAttribute('placeholder', params.translations[key ?? ''] ?? '--');
      break;
    case DataAttributeName.FullYear:
      params.element.textContent = new Date().getFullYear().toString();
      break;
    default:
      break;
  }
}

export const setTranslations = async (route: RouteEntity): Promise<void> => {
  const translations = await getTranslations();
  document.title = translations[route.metaTitleKey] ?? '---';
  const textElements = document.querySelectorAll(`[${DataAttributeName.Text}]`);
  textElements.forEach((elm) =>  {
    translate({ translations, attributeName: DataAttributeName.Text, element: elm })
  });
  const fullYearElements = document.querySelectorAll(`[${DataAttributeName.FullYear}]`);
  fullYearElements.forEach((elm) =>  {
    translate({ translations, attributeName: DataAttributeName.FullYear, element: elm })
  });
  const placeholderElements = document.querySelectorAll(`[${DataAttributeName.Placeholder}]`);
  placeholderElements.forEach((elm) =>  {
    translate({ translations, attributeName: DataAttributeName.Placeholder, element: elm })
  });
}
