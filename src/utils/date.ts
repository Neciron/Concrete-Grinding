import { format } from 'fecha';

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

export const asDateTime = (dateString: Date|string|null, template = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!dateString) {
    return '--';
  }
  let date = null;
  try {
    date = new Date(dateString);
  } catch (error) {
    console.error('asDateTime - invalid dateString!', dateString);
  }
  if (!date) {
    return '--';
  }

  return format(date, template);
};
