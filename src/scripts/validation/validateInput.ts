export const validateInput = (values: string[], rules: ValidationRule[], optional?: true): string|null => {
  if (optional) {
    if (values.length === 0) {
      return null;
    }
    if (values.length === 1) {
      const value = values[0];
      if (!value?.trim()) {
        return null;
      }
    }
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
