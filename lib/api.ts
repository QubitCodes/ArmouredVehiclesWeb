// src/lib/api.ts
import type {
  User,
  AuthResponse,
  OtpStartResponse,
  Product,
  Category,
  CartItem,
  Order,
  Address,
  SavedPaymentMethod,
  Review,
  Refund,
  Session,
  ProductFilters,
  FilterOptions,
} from './types';

// 1. Safe Environment Variable Access
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://armored-api.qubyt.codes/api";
console.log("API_BASE", API_BASE);

// ==================== Token Management (Client Side Only) ====================

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const USER_KEY = 'user';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function storeTokens(accessToken: string, refreshToken: string, expiresIn: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // Store absolute expiry time (current time + seconds)
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
}

export function storeUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(USER_KEY);
}

function isTokenExpiringSoon(): boolean {
  if (typeof window === 'undefined') return false;
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  // Refresh if expiring in less than 60 seconds
  return Date.now() > parseInt(expiry) - 60000;
}

// ==================== Token Refresh Logic ====================

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  refreshPromise = (async () => {
    try {
      // Use raw fetch to avoid infinite loops
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      storeTokens(data.accessToken, data.refreshToken, data.expiresIn);
      return true;
    } catch (error) {
      clearTokens();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ==================== HTTP Client (The Core) ====================

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Unified Fetch Function
async function fetchJson<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
  // 1. Pre-check: Refresh token if expiring soon
  if (typeof window !== 'undefined' && isTokenExpiringSoon() && getRefreshToken()) {
    await refreshAccessToken();
  }

  const url = `${API_BASE}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // 2. Error handling: If 401 Unauthorized, try to refresh and retry ONCE
  if (response.status === 401 && retry && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the original request with new token
      return fetchJson<T>(endpoint, options, false);
    }
  }

  // 3. General Error Handling
  if (!response.ok) {
    let errorMsg = 'Request failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || response.statusText;
    } catch {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  // 4. Handle Empty Responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ==================== API Methods ====================

export const api = {
  // --- Auth ---
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      // Direct fetch to avoid interceptor circular logic, but simplified
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      storeTokens(data.accessToken, data.refreshToken, data.expiresIn);
      storeUser(data.user);
      return data;
    },

    register: async (name: string, email: string, password: string, userType = 'customer'): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, userType }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      storeTokens(data.accessToken, data.refreshToken, data.expiresIn);
      storeUser(data.user);
      return data;
    },

    // OTP Login Flow
    otpLoginStart: async (email: string): Promise<OtpStartResponse> => {
      const response = await fetch(`${API_BASE}/auth/otp/login/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'OTP start failed');
      return data;
    },

    otpLoginVerify: async (email: string, code: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE}/auth/otp/login/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'OTP verify failed');

      storeTokens(data.accessToken, data.refreshToken, data.expiresIn);
      storeUser(data.user);
      return data;
    },

    logout: async (): Promise<void> => {
      try {
        await fetchJson('/auth/logout', { method: 'POST' });
      } catch (err) {
        console.error("Logout API failed", err);
      } finally {
        clearTokens();
        // Optional: Redirect to login page here if needed
      }
    },

    logoutAll: () => fetchJson<{ message: string }>('/auth/logout-all', { method: 'POST' }),
    me: () => fetchJson<User>('/auth/me'),
    getSessions: () => fetchJson<Session[]>('/auth/sessions'),
    revokeSession: (sessionId: string) => fetchJson<{ message: string }>(`/auth/sessions/${sessionId}`, { method: 'DELETE' }),
    updateProfile: (data: { name?: string; email?: string }) => fetchJson<User>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // --- Products ---
  products: {
    getAll: async (filters?: ProductFilters) => {
      const params = new URLSearchParams();
      // Backend expects snake_case: category_id
      if (filters?.categoryId)
        params.set('category_id', filters.categoryId.toString());
      // Keep generic search/min/max if backend supports; harmless if ignored
      if (filters?.search) params.set('search', filters.search);
      if (typeof filters?.minPrice === 'number')
        params.set('min_price', String(filters.minPrice));
      if (typeof filters?.maxPrice === 'number')
        params.set('max_price', String(filters.maxPrice));
      if (filters?.vendorId) params.set('vendor_id', filters.vendorId);

      const queryString = params.toString();
      const res = await fetchJson<any>(`/products${queryString ? `?${queryString}` : ''}`);
      // Many endpoints wrap payload in { data: [...] }
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    getFeatured: () => fetchJson<Product[]>('/products/featured'),
    getTopSelling: () => fetchJson<Product[]>('/products/top-selling'),
    getCategories:() => fetchJson<Product[]>('/api/categories'),
        getSliderProduct:() => fetchJson<Product[]>('/api/products'),

    getById: (id: number) => fetchJson<Product>(`/products/${id}`),
    getSimilar: (id: number) => fetchJson<Product[]>(`/products/${id}/similar`),
    getRecommended: (id: number) => fetchJson<Product[]>(`/products/${id}/recommended`),
  },

  // --- Categories ---
  categories: {
    getAll: () => fetchJson<Category[]>('/categories'),
  },

  // --- Reviews ---
  reviews: {
    getByProduct: (productId: number) => fetchJson<Review[]>(`/products/${productId}/reviews`),
    create: (productId: number, data: { rating: number; comment: string }) =>
      fetchJson<Review>(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  },

  // --- Cart ---
  cart: {
    get: () => fetchJson<CartItem[]>('/cart'),
    add: (productId: number, quantity = 1) =>
      fetchJson<CartItem>('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
    update: (id: number, quantity: number) =>
      fetchJson<CartItem>(`/cart/${id}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
    // Updated to use fetchJson for consistency
    remove: (id: number) => fetchJson<{ success: boolean }>(`/cart/${id}`, { method: 'DELETE' }),
  },

  // --- Checkout ---
  checkout: {
    createSession: () => fetchJson<{ url?: string; testMode?: boolean; orderId?: string; error?: string }>('/checkout/create-session', { method: 'POST' }),
  },

  // --- Orders ---
  orders: {
    getAll: () => fetchJson<Order[]>('/orders'),
    getById: (id: string) => fetchJson<Order>(`/orders/${id}`),
    create: (items: any[]) => fetchJson<Order>('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
  },

  // --- Refunds ---
  refunds: {
    getAll: () => fetchJson<Refund[]>('/refunds'),
    getById: (id: string) => fetchJson<Refund>(`/refunds/${id}`),
  },

  // --- Addresses ---
  addresses: {
    getAll: () => fetchJson<Address[]>('/addresses'),
    create: (data: any) => fetchJson<Address>('/addresses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => fetchJson<Address>(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchJson<{ success: boolean }>(`/addresses/${id}`, { method: 'DELETE' }),
    setDefault: (id: number) => fetchJson<{ success: boolean }>(`/addresses/${id}/default`, { method: 'POST' }),
  },

  // --- Payments ---
  payments: {
    getAll: () => fetchJson<SavedPaymentMethod[]>('/payments'),
    create: (data: any) => fetchJson<SavedPaymentMethod>('/payments', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: number) => fetchJson<{ success: boolean }>(`/payments/${id}`, { method: 'DELETE' }),
    setDefault: (id: number) => fetchJson<{ success: boolean }>(`/payments/${id}/default`, { method: 'POST' }),
  },

  // --- Filters ---
filters: {
  get: (params?: {
    categoryId?: number;
    brand?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const search = new URLSearchParams();

    if (params?.categoryId)
      search.set("categoryId", params.categoryId.toString());

    if (params?.minPrice !== undefined)
      search.set("minPrice", params.minPrice.toString());

    if (params?.maxPrice !== undefined)
      search.set("maxPrice", params.maxPrice.toString());

    if (params?.brand?.length)
      params.brand.forEach((b) => search.append("brand", b));

    return fetchJson<FilterOptions>(
      `/filters${search.toString() ? `?${search.toString()}` : ""}`
    );
  },
},


  // --- User ---
  user: {
    getCurrent: () => fetchJson<User>('/user'),
  },

  // --- Vendor ---
  vendor: {
    getStats: () => fetchJson<any>('/vendor/stats'),
    getProducts: () => fetchJson<Product[]>('/vendor/products'),
    createProduct: (data: any) => fetchJson<Product>('/vendor/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id: number, data: any) => fetchJson<Product>(`/vendor/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id: number) => fetchJson<{ success: boolean }>(`/vendor/products/${id}`, { method: 'DELETE' }),
    getOrders: () => fetchJson<Order[]>('/vendor/orders'),
    updateOrderStatus: (orderId: string, status: string, note?: string) =>
      fetchJson<Order>(`/vendor/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
    getOrderHistory: (orderId: string) => fetchJson<any[]>(`/vendor/orders/${orderId}/history`),
    getCustomers: () => fetchJson<User[]>('/vendor/customers'),
    getAnalytics: () => fetchJson<any>('/vendor/analytics'),
    submitOnboardingStep2: (data: {
      contactFullName: string;
      contactJobTitle?: string;
      contactWorkEmail: string;
      contactIdDocumentUrl?: string;
      contactMobile: string;
      contactMobileCountryCode: string;
      termsAccepted: boolean;
    }) => fetchJson<{ success: boolean; message?: string }>(
      '/vendor/onboarding/step2',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  },
};

export default api;