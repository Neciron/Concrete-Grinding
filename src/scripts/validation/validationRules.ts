import { $t } from '../$t';

const hasWhitSpacesRegexp = /\s/;
const cyrillicRegex = /[а-яА-ЯЁё]/;
const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const minOneSpecialRegExp = /(?=.*[!@#$%^&*])/;
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const minOneNumericRegExp = /(?=.*[0-9])/;
const onlyLowerCaseAndUnderscoreRegExp = /^[a-z_]+$/;
const onlyNumbers = /^\d+$/;
const onlyCyrillicSymbols = /^[а-яА-ЯІіЇїЄєҐґ]*$/;
const cyrillicOrDigitsRegxEp = /^[а-яА-ЯІіЇїЄєҐґ0-9\s'-]+$/;


const required: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return $t('app_validation_error_required');
  }
  return null;
};

const onlyLowerCaseAndUnderscore: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!onlyLowerCaseAndUnderscoreRegExp.test(value)) {
    return $t('app_validation_error_only_lowercase_and_underscore');
  }
  return null;
};

const noWhitespace: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (hasWhitSpacesRegexp.test(value)) {
    return $t('app_validation_error_whitespace');
  }
  return null;
};

const noCyrillic: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (cyrillicRegex.test(value)) {
    return $t('app_validation_error_only_latin');
  }
  return null;
};

const maxLength = (max: number): ValidationRule => (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (value.length > max) {
    return $t('app_validation_error_too_long');
  }
  return null;
};

const minLength = (min: number): ValidationRule => (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (value.length < min) {
    return $t('app_validation_error_too_short');
  }
  return null;
};

const email: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!emailRegexp.test(value)) {
    return $t('app_validation_error_email');
  }
  return null;
};

const minOneSpecial: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!minOneSpecialRegExp.test(value)) {
    return $t('app_validation_error_min_one_special');
  }
  return null;
};

const minOneNumeric: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!minOneNumericRegExp.test(value)) {
    return $t('app_validation_error_min_one_numeric');
  }
  return null;
};

const minOneLowercase: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!lowerCaseRegExp.test(value)) {
    return $t('app_validation_error_min_one_lowercase');
  }
  return null;
};

const minOneUppercase: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!upperCaseRegExp.test(value)) {
    return $t('app_validation_error_min_one_uppercase');
  }
  return null;
};

const phone: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!onlyNumbers.test(value)) {
    return $t('app_validation_error_phone_only_digits');
  }
  if (value.length !== 10 && value.length !== 12) {
    return $t('app_validation_error_phone_invalid_length');
  }
  return null;
};

const onlyCyrillic: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  const isCyrillic = onlyCyrillicSymbols.test(value);
  if (!isCyrillic) {
    return $t('app_validation_error_only_cyrillic');
  }
  return null;
};


const onlyCyrillicOrDigits: ValidationRule = (values) => {
  const value = values[0]?.trim();
  if (!value) {
    return null;
  }
  if (!cyrillicOrDigitsRegxEp.test(value)) {
    return $t('app_validation_error_only_cyrillic_or_digits');
  }
  return null;
};

const maxFileSize = (maxSize: number): ValidationFileRule => (values) => {
  const value = values[0];
  if (!value) {
    return null;
  }
  if (value.size > maxSize) {
    return $t('app_validation_error_file_too_large');
  }
  return null;
};

const fileType = (allowedTypes: string[]): ValidationFileRule => (values) => {
  const value = values[0];
  if (!value) {
    return null;
  }
  if (!allowedTypes.includes(value.type)) {
    return $t('app_validation_error_file_type');
  }
  return null;
};

export const validationRules = {
  email,
  fileType,
  maxFileSize,
  maxLength,
  minLength,
  minOneLowercase,
  minOneNumeric,
  minOneSpecial,
  minOneUppercase,
  noCyrillic,
  noWhitespace,
  onlyCyrillic,
  onlyCyrillicOrDigits,
  onlyLowerCaseAndUnderscore,
  phone,
  required,
};
