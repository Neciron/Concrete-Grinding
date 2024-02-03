import { apiTranslations } from '@/api';
import { child } from '@firebase/database';
import { getDatabase } from '@firebase/database';
import type { ITranslateManager } from '@/types';
import type { ITranslateManagerProps } from '@/types';
import { onValue } from '@firebase/database';
import { ref } from '@firebase/database';

enum AttributeName {
  FullYear = 'data-tr-full-year',
  Placeholder = 'data-tr-placeholder',
  Text = 'data-tr-text',
  Title = 'data-tr-title',
}

export class TranslateManager implements ITranslateManager {
  public translations;
  public readonly route;

  public constructor(props: ITranslateManagerProps) {
    this.translations = props.translations;
    this.route = props.route;
  }

  public async init(): Promise<void> {
    const transactions = await apiTranslations.getTranslations().catch(() => {
      return null;
    });
    this.translations = transactions ?? {};
    window.translations = this.translations;
    this.addWatcher();
  }

  public translatePage(): void {
    const metaTitleKey = this.route?.metaTitleKey ?? 'app_meta_title_admin_panel';
    document.title = this.translations[metaTitleKey] ?? '---';
    const textElements = document.querySelectorAll(`[${AttributeName.Text}]`);
    textElements.forEach((elm) => {
      this.translate(AttributeName.Text, elm);
    });
    const fullYearElements = document.querySelectorAll(`[${AttributeName.FullYear}]`);
    fullYearElements.forEach((elm) => {
      this.translate(AttributeName.FullYear, elm);
    });
    const placeholderElements = document.querySelectorAll(`[${AttributeName.Placeholder}]`);
    placeholderElements.forEach((elm) => {
      this.translate(AttributeName.Placeholder, elm);
    });
    const titleElements = document.querySelectorAll(`[${AttributeName.Title}]`);
    titleElements.forEach((elm) => {
      this.translate(AttributeName.Title, elm);
    });
  }

  public async saveTranslation(key: string, value: string): Promise<boolean> {
    const result = await apiTranslations.saveTranslation(key, value).catch(() => {
      return false;
    });
    if (result) {
      this.translations[key] = value;
      window.translations = this.translations;
    }
    return result;
  }

  private addWatcher(): void {
    const dbRef = ref(getDatabase());
    onValue(child(dbRef, 'translations'), (snapshot) => {
      const data = snapshot.val() as Translations;
      this.translations = data;
      window.translations = this.translations;
      this.translatePage();
    });
  }

  private translate(attributeName: AttributeName, element: Element): void {
    const key = element.getAttribute(attributeName);
    let value = this.translations[key ?? ''];
    if (!value) {
      if (attributeName !== AttributeName.FullYear) {
        console.error(`Translation not found for key: ${key}`);
      }
      value = key ?? '???';
    }
    switch (attributeName) {
      case AttributeName.Text:
        element.textContent = value;
        break;
      case AttributeName.Placeholder:
        element.setAttribute('placeholder', value);
        break;
      case AttributeName.FullYear:
        element.textContent = new Date().getFullYear().toString();
        break;
      case AttributeName.Title:
        element.setAttribute('title', value);
        break;
      default:
        break;
    }
  }
}
