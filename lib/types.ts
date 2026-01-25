export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  userType: 'customer' | 'vendor' | 'admin' | 'super_admin';
  phone?: string;
  avatar?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  country_code?: string;
  onboardingStep?: number | null;
  completionPercentage?: number;
  profile?: {
    mobile?: string;
    mobile_country_code?: string;
    job_title?: string;
    country?: string;
    country_of_registration?: string;
    contact_full_name?: string;
    contact_email?: string;
    [key: string]: any;
  };
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
  media?: {
    url: string;
    type: string;
    is_cover: boolean;
  }[];
  brand?: { id: number; name: string } | null;
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
  parent_id?: number | null;
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
  order_id?: string | null;
  order_group_id?: string | null;
  vendor_id?: string | null;
  vat_amount?: number;
  admin_commission?: number;
  user_id: string;
  order_status: "order_received" | "vendor_approved" | "vendor_rejected" | "pending_review" | "pending_approval" | "approved" | "rejected" | "cancelled" | "processing" | "shipped" | "delivered" | "returned" | "Order Received" | "Pending Review" | "Approved";
  total_amount: number;
  currency: string;
  type: "direct" | "request";
  payment_status?: "pending" | "paid" | "failed" | "refunded" | null;
  shipment_status?: "pending" | "processing" | "shipped" | "delivered" | "returned" | "cancelled" | null;
  comments?: string | null;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  items?: OrderItem[];
  address?: {
      name?: string;
      address_line1?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
  };
}

export interface OrderItem {
  id: number;
  orderId: string;
  productId: number;
  vendorId?: string;
  name?: string; // Legacy/Fallback
  product_name?: string; // From DB
  image?: string; // Legacy/Fallback
  price: string;
  quantity: number;
  product?: Product; // Relation
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
  full_name?:string;
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
  categoryId?: number | string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
  need_filters?: boolean; // Indicates if filter options are needed
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


