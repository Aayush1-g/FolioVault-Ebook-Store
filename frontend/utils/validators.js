export const validators = {
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address',

  password: (v) =>
    v.length >= 8 ? '' : 'Password must be at least 8 characters',

  name: (v) =>
    v.trim().length >= 2 ? '' : 'Name must be at least 2 characters',

  confirmPassword: (v, original) =>
    v === original ? '' : 'Passwords do not match',

  required: (v) =>
    v.trim() ? '' : 'This field is required',

  cardNumber: (v) =>
    /^\d{16}$/.test(v.replace(/\s/g, '')) ? '' : 'Enter a valid 16-digit card number',

  expiry: (v) =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? '' : 'Format: MM/YY',

  cvv: (v) =>
    /^\d{3,4}$/.test(v) ? '' : 'Enter a 3 or 4 digit CVV',

  zip: (v) =>
    /^[\d\w\s-]{3,10}$/.test(v.trim()) ? '' : 'Enter a valid postal / ZIP code',
}

/**
 * Run multiple validators on a form object.
 * rules: { fieldName: (value) => errorString }
 * Returns: { fieldName: errorString }  — empty string means valid.
 */
export function runValidation(form, rules) {
  const errors = {}
  for (const [field, ruleFn] of Object.entries(rules)) {
    errors[field] = ruleFn(form[field] ?? '')
  }
  return errors
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}
