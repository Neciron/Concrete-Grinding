export {};

declare global {
  type Translations = Record<string, string>;
  type ValidationRule = (values: string[]) => string|null;
  interface TableHeader {
    readonly title: string;
    readonly key: string;
  }
  interface Window {
    translations: Translations;
  }
}

