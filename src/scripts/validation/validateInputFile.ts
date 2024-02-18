import { $t } from '../$t';

export const validateInputFile = (values: FileList|null, rules: ValidationFileRule[], optional?: true): string|null => {
  if (optional) {
    if (!values || values.length === 0) {
      return null;
    }
    if (values.length === 1) {
      const value = values[0];
      if (!value) {
        return null;
      }
    }
  }
  if (!values || values.length === 0) {
    return $t('app_validation_error_required');
  }
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (!rule) {
      return null;
    }
    const error = rule(values);
    if (error) {
      return error;
    }
  }
  return null;
};
