export {};

declare global {
  type Translations = Record<string, string>;
  type ValidationRule = (values: string[]) => string|null;

  interface Window {
    translations: Translations;
  }
}