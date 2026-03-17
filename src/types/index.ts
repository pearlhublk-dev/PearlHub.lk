// Types for PearlHub Platform

// User & Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'PROVIDER_STAY' 
  | 'PROVIDER_VEHICLE' 
  | 'PROVIDER_EVENT' 
  | 'PROVIDER_SME'
  | 'COMPLIANCE_OFFICER'
  | 'USER';

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Listings
export interface Listing {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  images: string[];
  location: Location;
  price: Price;
  amenities: string[];
  availability: Availability;
  provider: Provider;
  reviews: Review[];
  rating: number;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ListingType = 'STAY' | 'VEHICLE' | 'EVENT' | 'SERVICE';

export type ListingStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED';

export interface Location {
  address: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  coordinates?: GeoCoordinates;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Price {
  basePrice: number;
  currency: string;
  unit: 'PER_NIGHT' | 'PER_DAY' | 'PER_HOUR' | 'PER_PERSON' | 'FIXED';
  dynamicPricing?: DynamicPricing;
}

export interface DynamicPricing {
  weekendMultiplier?: number;
  seasonalRates?: SeasonalRate[];
  bulkDiscounts?: BulkDiscount[];
}

export interface SeasonalRate {
  startDate: Date;
  endDate: Date;
  multiplier: number;
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercentage: number;
}

export interface Availability {
  calendar: Date[];
  exceptions: AvailabilityException[];
  minAdvanceBooking: number; // hours
  maxAdvanceBooking: number; // days
  instantBooking: boolean;
}

export interface AvailabilityException {
  date: Date;
  available: boolean;
  reason?: string;
  specialPrice?: number;
}

// Provider
export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  businessRegistration: string;
  taxId?: string;
  categories: ProviderCategory[];
  commissionRate: number;
  paymentPartner: PaymentPartner;
  verificationStatus: VerificationStatus;
  rating: number;
  totalBookings: number;
  createdAt: Date;
}

export type ProviderCategory = 
  | 'STAY' 
  | 'VEHICLE' 
  | 'EVENT' 
  | 'SME'
  | 'HOTEL'
  | 'RESORT'
  | 'GUEST_HOUSE'
  | 'VACATION_RENTAL'
  | 'CAR'
  | 'VAN'
  | 'MOTORCYCLE'
  | 'BUS'
  | 'CONCERT'
  | 'SPORTS'
  | 'THEATER'
  | 'CONFERENCE'
  | 'WORKSHOP';

export type PaymentPartner = 'STRIPE' | 'PAYPAL' | 'PAYHERE' | 'BANK_TRANSFER';

export type VerificationStatus = 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';

// Booking
export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  providerId: string;
  status: BookingStatus;
  dates: BookingDates;
  guests: GuestInfo;
  pricing: BookingPricing;
  payment: PaymentInfo;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'DISPUTED';

export interface BookingDates {
  checkIn: Date;
  checkOut: Date;
  duration: number; // in days/hours
}

export interface GuestInfo {
  adults: number;
  children: number;
  infants?: number;
  pets?: number;
}

export interface BookingPricing {
  basePrice: number;
  cleaningFee?: number;
  serviceFee: number;
  taxes: number;
  discount?: number;
  total: number;
  currency: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
}

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'EWALLET';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | 'DISPUTED';

// Review
export interface Review {
  id: string;
  bookingId: string;
  listingId: string;
  reviewerId: string;
  rating: number;
  categories?: ReviewCategories;
  comment: string;
  images?: string[];
  helpful: number;
  response?: ReviewResponse;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCategories {
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  checkIn: number;
  value: number;
}

export interface ReviewResponse {
  content: string;
  respondedAt: Date;
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  priority: NotificationPriority;
  createdAt: Date;
}

export type NotificationType = 
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_FAILED'
  | 'REVIEW_RECEIVED'
  | 'MESSAGE_RECEIVED'
  | 'LISTING_APPROVED'
  | 'LISTING_REJECTED'
  | 'VERIFICATION_COMPLETE'
  | 'SYSTEM_ANNOUNCEMENT';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

// Analytics
export interface AnalyticsMetrics {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  averageRating: number;
  conversionRate: number;
  period: DateRange;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Search & Filter
export interface SearchFilters {
  type?: ListingType;
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: GuestInfo;
  priceRange?: PriceRange;
  amenities?: string[];
  rating?: number;
  instantBook?: boolean;
  sortBy?: SortOption;
}

export interface PriceRange {
  min: number;
  max: number;
}

export type SortOption = 
  | 'RECOMMENDED'
  | 'PRICE_LOW_TO_HIGH'
  | 'PRICE_HIGH_TO_LOW'
  | 'RATING_HIGH'
  | 'NEWEST';

// Compliance
export interface ComplianceRecord {
  id: string;
  providerId: string;
  type: ComplianceType;
  documentUrl: string;
  status: VerificationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

export type ComplianceType = 
  | 'BUSINESS_LICENSE'
  | 'INSURANCE'
  | 'SAFETY_CERTIFICATE'
  | 'TAX_CLEARANCE'
  | 'IDENTITY_VERIFICATION'
  | 'ADDRESS_VERIFICATION';

// Feature Flags
export interface FeatureFlags {
  enableBetaFeatures: boolean;
  enableRealTimeTracking: boolean;
  enableAiRecommendations: boolean;
  enableAdvancedAnalytics: boolean;
  enableVideoCalls: boolean;
  enableMultiCurrency: boolean;
}
