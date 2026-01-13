// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  userType: 'customer' | 'vendor' | 'admin' | 'super_admin';
  avatar?: string;
  completionPercentage?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// OTP Login Types
export interface OtpStartResponse {
  message: string;
  expiresIn: number;
  debugOtp?: string;
}

// OTP Registration Types
export interface OtpRegisterStartResponse {
  message: string;
  userId: string;
  email: string;
  name: string;
  username: string;
  resuming: boolean;
  expiresIn: number;
  debugOtp?: string;
}

export interface VerifyEmailResponse {
  message: string;
  userId: string;
  nextStep: 'phone_number' | string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  originalPrice?: string;
  image: string;
  gallery?: string[];
  categoryId?: number;
  department?: string;
  description: string;
  condition: 'new' | 'used' | 'refurbished';
  stock: number;
  vendorId?: string;
  make: string;
  model: string;
  year: number;
  rating?: string;
  reviewCount?: number;
  features?: string[];
  specifications?: string;
  vehicleFitment?: string;
  warranty?: string;
  actionType?: string;
  createdAt: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  image: string;
  description?: string;
}

// Cart Types
export interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: string;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: string;
  productId: number;
  vendorId?: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
}

// Address Types
export interface Address {
  id: number;
  userId: string;
  label: string;
  addressType: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

// Payment Method Types
export interface SavedPaymentMethod {
  id: number;
  userId: string;
  paymentMethodType: 'card' | 'bank_account' | 'upi' | 'wallet';
  lastFourDigits?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  maskedAccountNumber?: string;
  bankName?: string;
  maskedUpiId?: string;
  processorToken: string;
  processorName: string;
  billingAddressId?: number;
  country: string;
  isDefault: boolean;
  hasRbiConsent: boolean;
  consentTimestamp?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

// Refund Types
export interface Refund {
  id: string;
  orderId: string;
  userId: string;
  status: 'processing' | 'completed' | 'failed';
  amount: string;
  paymentMethod: string;
  triggerDate: string;
  estimatedCreditDate?: string;
  completedAt?: string;
  createdAt: string;
  items?: RefundItem[];
}

export interface RefundItem {
  id: number;
  refundId: string;
  productId: number;
  name: string;
  image: string;
  price: string;
  quantity: number;
}

// Session Types
export interface Session {
  id: string;
  deviceLabel: string;
  ipAddress: string;
  lastUsedAt: string;
  createdAt: string;
  isCurrent: boolean;
}

// Filter Types
export interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
}

export interface FilterOptions {
  brands: string[];
  departments: string[];
  productTypes: { name: string; image: string }[];
  surfaceTypes: string[];
  frictionalMaterials: string[];

  priceRange?: {
    min: number;
    max: number;
  };
}


