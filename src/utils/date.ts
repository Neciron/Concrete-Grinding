export const fromDateTimeString = (value: string|null|undefined): Date|null => {
  if (typeof value !== 'string') {
    return null;
  }
  if (!value) {
    return null;
  }
  try {
    const date = new Date(value);
    return date;
  } catch (error) {
    console.error('fromDateTimeString error', error);
    return null;
  }
};
