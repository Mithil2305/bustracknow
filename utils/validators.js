/**
 * Input validators used across the app.
 */

const PHONE_REGEX = /^\+?[1-9]\d{9,14}$/;
const UPI_REGEX = /^[\w.-]+@[\w]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidPhone(phone) {
  return PHONE_REGEX.test(phone?.trim());
}

export function isValidUPI(upiId) {
  return UPI_REGEX.test(upiId?.trim());
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email?.trim());
}

/**
 * Validate a user display name.
 * @param {string} name
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateName(name) {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  if (name.trim().length > 50) {
    return { valid: false, error: "Name must not exceed 50 characters" };
  }
  return { valid: true };
}

/**
 * Validate coordinates.
 * @param {number} lat
 * @param {number} lng
 * @returns {boolean}
 */
export function isValidCoordinate(lat, lng) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
