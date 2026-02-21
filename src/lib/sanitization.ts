import DOMPurify from 'dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes any potentially dangerous HTML/script tags
 * @param dirty - User input string
 * @returns Sanitized string safe to display
 */
export const sanitizeInput = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Configure DOMPurify to be strict
  const config = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'ul', 'ol', 'li'], // Only safe HTML tags
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true,
  };

  return DOMPurify.sanitize(dirty, config);
};

/**
 * Escapes HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns Escaped text
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Validates and sanitizes email addresses
 * @param email - Email to validate and sanitize
 * @returns Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Remove whitespace and convert to lowercase
  const cleaned = email.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : '';
};

/**
 * Sanitizes URLs to prevent javascript: and data: attacks
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Block dangerous protocols
  if (
    trimmed.toLowerCase().startsWith('javascript:') ||
    trimmed.toLowerCase().startsWith('data:') ||
    trimmed.toLowerCase().startsWith('vbscript:')
  ) {
    return '';
  }

  // Validate URL format
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return '';
  }
};

/**
 * Validates and sanitizes phone numbers
 * @param phone - Phone number to validate
 * @returns Sanitized phone or empty string if invalid
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters except + and -
  const sanitized = phone.replace(/[^\d+\-]/g, '');

  // Basic phone validation (should contain at least 7 digits)
  const digitCount = sanitized.replace(/\D/g, '').length;
  return digitCount >= 7 && digitCount <= 15 ? sanitized : '';
};

/**
 * Strips HTML and special characters from text (for plain text usage)
 * @param text - Text to strip
 * @returns Plain text
 */
export const stripHtml = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');
};
