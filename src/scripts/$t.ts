export const $t = (key: string): string => {
  const text = window.translations[key];
  if (!text) {
    console.error(`Translation not found for key: ${key}`);
  }
  return text ?? key;
};
