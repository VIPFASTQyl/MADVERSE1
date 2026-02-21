import { z } from 'zod';

// User Registration Schema
export const UserRegistrationSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email too short')
    .max(255, 'Email too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
  firstName: z.string()
    .min(2, 'First name too short')
    .max(50, 'First name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string()
    .min(2, 'Last name too short')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
});

// User Login Schema
export const UserLoginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required'),
});

// Activity Registration Schema
export const ActivityRegistrationSchema = z.object({
  activityId: z.string()
    .uuid('Invalid activity ID')
    .min(1, 'Activity ID is required'),
  userId: z.string()
    .uuid('Invalid user ID')
    .min(1, 'User ID is required'),
  notes: z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional(),
});

// Contact Form Schema
export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name too short')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email address'),
  subject: z.string()
    .min(5, 'Subject too short')
    .max(200, 'Subject too long'),
  message: z.string()
    .min(10, 'Message too short')
    .max(2000, 'Message too long'),
});

// Activity Content Schema
export const ActivityContentSchema = z.object({
  itemName: z.string()
    .min(3, 'Activity name too short')
    .max(200, 'Activity name too long'),
  description: z.string()
    .min(10, 'Description too short')
    .max(2000, 'Description too long'),
  date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
  linkUrl: z.string()
    .url('Invalid link URL')
    .optional(),
  activityType: z.enum(['arts', 'culture', 'sports', 'youth', 'exhibition', 'volunteering']),
});

// Password Reset Schema
export const PasswordResetSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
});

export const NewPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Export types
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type ActivityRegistration = z.infer<typeof ActivityRegistrationSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type ActivityContent = z.infer<typeof ActivityContentSchema>;
export type PasswordReset = z.infer<typeof PasswordResetSchema>;
export type NewPassword = z.infer<typeof NewPasswordSchema>;
