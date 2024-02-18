import type { Route } from './IRoute';

export interface ITranslateManagerProps {
  readonly translations: Translations;
  readonly route: Route|null;
}

export interface ITranslateManager extends ITranslateManagerProps {
  init: () => Promise<void>;
  translatePage: () => void;
  saveTranslation: (key: string, value: string) => Promise<boolean>;
  removeTranslation: (key: string) => Promise<boolean>;
}
