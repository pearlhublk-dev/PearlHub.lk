import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^(?:\+94|0)?(?:7\d{8}|11\d{7}|21\d{7}|31\d{7}|41\d{7}|51\d{7}|52\d{7}|54\d{7}|55\d{7}|57\d{7}|63\d{7}|65\d{7}|66\d{7}|67\d{7}|81\d{7}|91\d{7})$/, 'Invalid Sri Lankan phone number'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'PROVIDER_STAY', 'PROVIDER_VEHICLE', 'PROVIDER_EVENT', 'PROVIDER_SME', 'COMPLIANCE_OFFICER', 'USER']),
  verified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^(?:\+94|0)?(?:7\d{8})$/, 'Invalid mobile number').optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Listing validation schemas
export const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  type: z.enum(['STAY', 'VEHICLE', 'EVENT', 'SERVICE']),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    district: z.string().min(2, 'District is required'),
    province: z.string().min(2, 'Province is required'),
    postalCode: z.string().optional(),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }).optional(),
  }),
  price: z.object({
    basePrice: z.number().positive('Price must be positive'),
    currency: z.string().default('LKR'),
    unit: z.enum(['PER_NIGHT', 'PER_DAY', 'PER_HOUR', 'PER_PERSON', 'FIXED']),
  }),
  amenities: z.array(z.string()).max(50, 'Maximum 50 amenities allowed'),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
  capacity: z.object({
    adults: z.number().int().positive(),
    children: z.number().int().min(0).default(0),
    infants: z.number().int().min(0).default(0),
  }).optional(),
});

// Booking validation schemas
export const bookingSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
  checkIn: z.date().refine(date => date > new Date(), 'Check-in date must be in the future'),
  checkOut: z.date(),
  guests: z.object({
    adults: z.number().int().positive().max(50, 'Maximum 50 adults'),
    children: z.number().int().min(0).max(20, 'Maximum 20 children'),
    infants: z.number().int().min(0).max(10, 'Maximum 10 infants'),
  }),
  specialRequests: z.string().max(500, 'Special requests must be under 500 characters').optional(),
}).refine(data => data.checkOut > data.checkIn, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
});

// Review validation schemas
export const reviewSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  categories: z.object({
    cleanliness: z.number().int().min(1).max(5).optional(),
    accuracy: z.number().int().min(1).max(5).optional(),
    communication: z.number().int().min(1).max(5).optional(),
    location: z.number().int().min(1).max(5).optional(),
    checkIn: z.number().int().min(1).max(5).optional(),
    value: z.number().int().min(1).max(5).optional(),
  }).optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review must be under 2000 characters'),
  images: z.array(z.string().url()).max(5, 'Maximum 5 images allowed').optional(),
});

// Provider validation schemas
export const providerSchema = z.object({
  businessName: z.string().min(3, 'Business name must be at least 3 characters').max(200),
  businessRegistration: z.string().min(5, 'Registration number is required'),
  taxId: z.string().optional(),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100'),
  paymentPartner: z.enum(['STRIPE', 'PAYPAL', 'PAYHERE', 'BANK_TRANSFER']),
});

// Search filters validation
export const searchFiltersSchema = z.object({
  type: z.enum(['STAY', 'VEHICLE', 'EVENT', 'SERVICE']).optional(),
  location: z.string().min(2).optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  guests: z.object({
    adults: z.number().int().positive().optional(),
    children: z.number().int().min(0).optional(),
    infants: z.number().int().min(0).optional(),
  }).optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  amenities: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5).optional(),
  instantBook: z.boolean().optional(),
  sortBy: z.enum(['RECOMMENDED', 'PRICE_LOW_TO_HIGH', 'PRICE_HIGH_TO_LOW', 'RATING_HIGH', 'NEWEST']).optional(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
  captchaToken: z.string().min(1, 'Please complete the captcha'),
});

// Password reset validation
export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ID validation helper
export const uuidSchema = z.string().uuid('Invalid ID format');

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Export types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProviderInput = z.infer<typeof providerSchema>;
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
