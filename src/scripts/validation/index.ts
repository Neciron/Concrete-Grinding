const hasWhitSpacesRegexp = /\s/;
const cyrillicRegex = /[а-яА-ЯЁё]/;
const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const minOneSpecialRegExp = /(?=.*[!@#$%^&*])/;
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const minOneNumericRegExp = /(?=.*[0-9])/;

const $t = (key: string): string => window.translations[key] ?? key;

const required: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return $t('app_validation_error_required');
  }
  return null;
}

const noWhitespace: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (hasWhitSpacesRegexp.test(value)) {
    return $t('app_validation_error_whitespace');
  }
  return null;
}

const noCyrillic: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (cyrillicRegex.test(value)) {
    return $t('app_validation_error_only_latin');
  }
  return null;
}

const maxLength = (max: number): ValidationRule => (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (value.length > max) {
    return $t('app_validation_error_too_long');
  }
  return null;
}

const minLength = (min: number): ValidationRule => (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (value.length < min) {
    return $t('app_validation_error_too_short');
  }
  return null;
}

const email: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!emailRegexp.test(value)) {
    return $t('app_validation_error_email');
  }
  return null;
}

const minOneSpecial: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!minOneSpecialRegExp.test(value)) {
    return $t('app_validation_error_min_one_special');
  }
  return null;
}

const minOneNumeric: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!minOneNumericRegExp.test(value)) {
    return $t('app_validation_error_min_one_numeric');
  }
  return null;
}

const minOneLowercase: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!lowerCaseRegExp.test(value)) {
    return $t('app_validation_error_min_one_lowercase');
  }
  return null;
}

const minOneUppercase: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!upperCaseRegExp.test(value)) {
    return $t('app_validation_error_min_one_uppercase');
  }
  return null;
}

export const validationRules = {
  required,
  maxLength,
  noWhitespace,
  noCyrillic,
  email,
  minLength,
  minOneSpecial,
  minOneNumeric,
  minOneLowercase,
  minOneUppercase,
}



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
      return error
    }
  }
  return null;
}