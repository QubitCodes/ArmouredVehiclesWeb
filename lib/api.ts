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
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://armapi.qubyt.codes/api/v1";

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
  if (!user || user === 'undefined' || user === 'null') return null;

  try {
    return JSON.parse(user);
  } catch (e) {
    console.error('Error parsing stored user:', e);
    return null;
  }
}

export function storeTokens(accessToken: string, refreshToken: string, expiresIn: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // Store absolute expiry time (current time + seconds)
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));

  // Sync to cookie for Middleware
  // Using encodeURIComponent to be safe, though JWTs are usually safe chars
  document.cookie = `auth_token=${encodeURIComponent(accessToken)}; path=/; max-age=${expiresIn}; SameSite=Lax`;
}

export function storeUser(user: User) {
  if (typeof window === 'undefined') return;
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);

  // Clear cookie
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  localStorage.removeItem(USER_KEY);
}

function isTokenExpiringSoon(): boolean {
  if (typeof window === 'undefined') return false;
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  // Refresh if expiring in less than 60 seconds
  return Date.now() > parseInt(expiry) - 60000;
}

export function syncAuthCookie() {
  if (typeof window === 'undefined') return;
  const token = getAccessToken();
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (token && expiry) {
    const expiresAt = parseInt(expiry);
    const expiresIn = Math.floor((expiresAt - Date.now()) / 1000);

    // Only set if not expired
    if (expiresIn > 0) {
      // console.log('Syncing auth cookie (valid)', expiresIn);
      document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${expiresIn}; SameSite=Lax`;
    } else {
      // console.log('Syncing auth cookie (expired/backup)', 3600);
      // Give it a grace period or let it expire naturally? 
      // For now, if we have a token but it says expired, we might want to refresh first.
      // But this sync is simple. Let's set it with a short life if we think it's valid enough to be in storage
      document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=3600; SameSite=Lax`;
    }
  } else if (token) {
    // console.log('Syncing auth cookie (no expiry)', 3600);
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=3600; SameSite=Lax`;
  }
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

// ==================== Session Management ====================

const SESSION_ID_KEY = 'session_id';

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
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
  const authHeaders = getAuthHeaders();
  console.log(`[CHECKOUT DEBUG] CLIENT REQUEST: ${endpoint}`, {
    token: (authHeaders as any).Authorization ? (authHeaders as any).Authorization.substring(0, 20) + '...' : 'NONE',
    fullToken: (authHeaders as any).Authorization
  });

  const headers: HeadersInit = {
    'x-session-id': getSessionId(), // Always send session ID
    ...authHeaders,
    ...options.headers,
  };

  // Only set application/json if not sending FormData (FormData needs browser-generated boundary)
  if (!(options.body instanceof FormData)) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { cache: 'no-store', ...options, headers });

  // 1.5 Global Auth Status Check (New Header)
  const authStatus = response.headers.get('x-auth-status');
  if (authStatus === 'invalid') {
    console.warn('[API] Invalid Token detected via Header. Disconnecting...');
    if (typeof window !== 'undefined') {
      clearTokens();
      window.dispatchEvent(new Event('auth:invalid'));
    }
    // Continue to process response? Usually safe to continue as public, 
    // but if the endpoint failed 401, step 2 will handle it.
    // If endpoint succeeded (200) but token was bad (Hybrid), we just log out locally.
  }

  // 2. Error handling: If 401 Unauthorized, try to refresh and retry ONCE
  if (response.status === 401) {
    if (retry && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        return fetchJson<T>(endpoint, options, false);
      }
    }

    // If we are here, it means 401 and either no refresh token or refresh failed (or retry failed)
    // Redirect to login
    if (typeof window !== 'undefined') {
      clearTokens(); // Ensure storage is cleared
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login')) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      }
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
    /** @deprecated OTP login is legacy. Use verifyFirebase instead. */
    x_otpLoginStart: async (email: string): Promise<OtpStartResponse> => {
      const response = await fetch(`${API_BASE}/auth/otp/login/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'OTP start failed');
      return data;
    },

    /** @deprecated OTP login is legacy. Use verifyFirebase instead. */
    x_otpLoginVerify: async (email: string, code: string): Promise<AuthResponse> => {
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

    // --- Firebase Auth ---
    checkUser: async (identifier: string): Promise<{ exists: boolean; data?: any; bypass?: boolean }> => {
      try {
        const response = await fetch(`${API_BASE}/auth/user-exists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, userType: 'customer' }),
        });
        const data = await response.json();
        if (response.status === 200) {
          return { exists: true, data: data.data };
        }
        // Handle Dev Backdoor Response (Status 100 often returns 200 OK via BaseController, but let's check payload)
        if (data.data?.bypass) {
          storeTokens(data.data.accessToken, data.data.refreshToken, data.data.expiresIn);
          storeUser(data.data.user);
          return { exists: true, data: data.data, bypass: true };
        }

        if (response.status === 404) return { exists: false };
        throw new Error(data.message || 'Check user failed');
      } catch (err) {
        console.error('Check user error', err);
        return { exists: false };
      }
    },

    verifyFirebase: async (idToken: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE}/auth/firebase/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const res = await response.json();
      if (!response.ok) {
        const error = new Error(res.message || 'Firebase verification failed');
        (error as any).status = response.status;
        (error as any).data = res.data || res.misc;
        throw error;
      }
      const payload = res.data ?? res;
      storeTokens(payload.accessToken, payload.refreshToken, payload.expiresIn);
      storeUser(payload.user);
      return payload;
    },

    registerFirebase: async (data: { idToken: string; name: string; username: string; userType?: string; phone?: string; countryCode?: string }): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE}/auth/firebase/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || 'Registration failed');
      const payload = resData.data ?? resData;
      storeTokens(payload.accessToken, payload.refreshToken, payload.expiresIn);
      storeUser(payload.user);
      return payload;
    },

    logout: async (refreshToken?: string): Promise<void> => {
      try {
        await fetchJson('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) });
      } catch (err) {
        console.error("Logout API failed", err);
      } finally {
        clearTokens();
      }
    },

    logoutAll: () => fetchJson<{ message: string }>('/auth/logout-all', { method: 'POST' }),

    me: async () => {
      const res = await fetchJson<any>('/profile');
      return res?.data?.user || res?.user;
    },

    getSessions: () => fetchJson<Session[]>('/auth/sessions'),
    revokeSession: (sessionId: string) => fetchJson<{ message: string }>(`/auth/sessions/${sessionId}`, { method: 'DELETE' }),

    updateProfile: async (data: { name?: string; email?: string; phone?: string; countryCode?: string; avatar?: string }) => {
      const res = await fetchJson<any>('/profile', { method: 'PUT', body: JSON.stringify(data) });
      return res?.data?.user || res?.user;
    },
  },

  // --- Products ---
  products: {
    getAll: async (filters?: ProductFilters) => {
      const params = new URLSearchParams();
      // console.log(`[CHECKOUT DEBUG] Fetching products with filters`, filters);
      // Backend expects snake_case: category_id
      if (filters?.categoryId) params.set('category_id', String(filters.categoryId));
      // Keep generic search/min/max if backend supports; harmless if ignored
      if (filters?.search) params.set('search', filters.search);
      if (typeof filters?.minPrice === 'number')
        params.set('min_price', String(filters.minPrice));
      if (typeof filters?.maxPrice === 'number')
        params.set('max_price', String(filters.maxPrice));
      if (filters?.vendorId) params.set('vendor_id', filters.vendorId);
      if (filters?.need_filters)
        params.set('need_filters', String(filters.need_filters));


      const queryString = params.toString();
      const res = await fetchJson<any>(`/products${queryString ? `?${queryString}` : ''}`);
      // Many endpoints wrap payload in { data: [...] }
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    // Returns the full API envelope including misc filters/meta
    getAllWithMeta: async (filters?: ProductFilters & Record<string, any>) => {
      const params = new URLSearchParams();

      // Known mappings
      if (filters?.categoryId)
        params.set('category_id', filters.categoryId.toString());
      if (filters?.search) params.set('search', filters.search);
      if (typeof filters?.minPrice === 'number')
        params.set('min_price', String(filters.minPrice));
      if (typeof filters?.maxPrice === 'number')
        params.set('max_price', String(filters.maxPrice));
      if ((filters as any)?.vendorId) params.set('vendor_id', (filters as any).vendorId);
      if ((filters as any)?.need_filters !== undefined)
        params.set('need_filters', String((filters as any).need_filters));

      // Pass-through any additional filter keys (e.g., colors, condition, countr_of_origin, brand, category_id)
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (
            [
              'categoryId',
              'search',
              'minPrice',
              'maxPrice',
              'vendorId',
              'need_filters',
            ].includes(key)
          )
            return;

          if (key === 'category_id') {
            params.set('category_id', String(value));
            return;
          }

          if (Array.isArray(value)) {
            if (value.length) params.set(key, value.join(','));
          } else if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
          ) {
            params.set(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      return fetchJson<any>(`/products${queryString ? `?${queryString}` : ''}`);
    },
    getFeatured: async () => {
      const res = await fetchJson<any>('/products/featured', { cache: 'no-store' });
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    getTopSelling: async () => {
      const res = await fetchJson<any>('/products/top-selling', { cache: 'no-store' });
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    // getCategories moved to api.categories.getAll
    getSliderProduct: () => fetchJson<Product[]>('/api/products'),

    getById: (id: string | number) => fetchJson<Product>(`/products/${id}`),

    // Fetch related products by category
    getRelated: async (categoryId: number | string) => {
      const res = await fetchJson<any>(`/products?category_id=${categoryId}&limit=4`);
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    getSimilar: (id: string | number) => fetchJson<Product[]>(`/products/${id}/similar`),
    getRecommended: (id: string | number) => fetchJson<Product[]>(`/products/${id}/recommended`),
    getSpecifications: async (id: string | number) => {
      const res = await fetchJson<any>(`/products/${id}/specifications`);
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    getCategories: async () => {
      const res = await fetchJson<any>("/categories");
      // Unwrap common API envelope { status, message, code, data }
      return Array.isArray(res) ? res : (res?.data ?? []);
    },
  },

  // --- Categories ---
  categories: {
    getAll: async () => {
      const res = await fetchJson<any>('/categories');
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    getById: async (id: number) => {
      const res = await fetchJson<any>(`/categories/${id}`);
      // Unwrap common API envelope { status, message, code, data }
      return res?.data ?? res;
    },
    // Fetch child categories by parent id
    getByParent: async (parentId: number) => {
      const res = await fetchJson<any>(`/categories/by-parent/${parentId}`);
      return Array.isArray(res) ? res : res?.data ?? [];
    },
  },

  // --- Reviews ---
  reviews: {
    getByProduct: (productId: string | number) => fetchJson<Review[]>(`/products/${productId}/reviews`),
    create: (productId: string | number, data: { rating: number; comment: string }) =>
      fetchJson<Review>(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  },

  // --- Wishlist ---
  wishlist: {
    get: () => fetchJson<any>('/wishlist'), // Type as any for now or WishlistResponse
    add: (productId: string | number) =>
      fetchJson<any>('/wishlist/items', { method: 'POST', body: JSON.stringify({ productId }) }),
    remove: (itemId: number) =>
      fetchJson<{ success: boolean }>(`/wishlist/items/${itemId}`, { method: 'DELETE' }),
  },

  // --- Cart ---
  cart: {
    get: () => fetchJson<CartItem[]>('/cart'),
    add: (productId: string | number, quantity = 1) =>
      fetchJson<CartItem>('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
    update: (id: number, quantity: number) =>
      fetchJson<CartItem>(`/cart/items/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    // Updated to use fetchJson for consistency
    remove: (id: number) => fetchJson<{ success: boolean }>(`/cart/items/${id}`, { method: 'DELETE' }),
    merge: () => fetchJson<{ message: string }>('/cart/merge', { method: 'POST' }),
  },

  // --- Checkout ---
  checkout: {
    createSession: (data?: any) => {
      const formData = new FormData();
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
      }
      return fetchJson<{ url?: string; testMode?: boolean; orderId?: string; error?: string; requiresApproval?: boolean; type?: string; paymentUrl?: string; redirectUrl?: string; clientSecret?: string }>('/checkout/create', { method: 'POST', body: formData });
    },
    verifySession: (data: { sessionId: string; orderId: string }) => {
      const formData = new FormData();
      formData.append('sessionId', data.sessionId);
      formData.append('orderId', data.orderId);
      return fetchJson<{ success: boolean; amount?: number; currency?: string; status?: string; orderId?: string }>('/checkout/verify-session', { method: 'POST', body: formData });
    },
    retryPayment: (data: { orderGroupId: string; embedded?: boolean }) => {
      const formData = new FormData();
      formData.append('orderGroupId', data.orderGroupId);
      if (data.embedded) formData.append('embedded', 'true');
      return fetchJson<{ message?: string; paymentUrl?: string; clientSecret?: string; sessionId?: string }>('/checkout/retry', { method: 'POST', body: formData });
    },
  },

  // --- Orders ---
  orders: {
    getAll: async () => {
      const res = await fetchJson<any>('/profile/orders');
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    getById: async (id: string) => {
      const res = await fetchJson<any>(`/profile/orders/${id}`);
      return res?.data ?? res;
    },
    getGroup: async (id: string) => {
      const res = await fetchJson<any>(`/profile/orders/group/${id}`);
      return res?.data ?? res;
    },
    create: (items: any[]) => fetchJson<Order>('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
  },

  // --- Refunds ---
  refunds: {
    getAll: () => fetchJson<Refund[]>('/profile/refunds'),
    getById: (id: string) => fetchJson<Refund>(`/profile/refunds/${id}`),
  },

  // --- Addresses ---
  addresses: {
    getAll: async () => {
      const res = await fetchJson<any>('/profile/addresses');
      return res?.data?.addresses || res?.addresses || [];
    },
    create: (data: any) => fetchJson<Address>('/profile/addresses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => fetchJson<Address>(`/profile/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchJson<{ success: boolean }>(`/profile/addresses/${id}`, { method: 'DELETE' }),
    setDefault: (id: number) => fetchJson<{ success: boolean }>(`/profile/addresses/${id}/default`, { method: 'POST' }),
  },

  // --- Payments ---
  payments: {
    getAll: () => fetchJson<SavedPaymentMethod[]>('/profile/payments'),
    create: (data: any) => fetchJson<SavedPaymentMethod>('/profile/payments', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: number) => fetchJson<{ success: boolean }>(`/profile/payments/${id}`, { method: 'DELETE' }),
    setDefault: (id: number) => fetchJson<{ success: boolean }>(`/profile/payments/${id}/default`, { method: 'POST' }),
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


  // --- Web Frontend ---
  webFrontend: {
    getSliders: async () => {
      const res = await fetchJson<any>('/web-frontend/sliders');
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    getAds: async (location?: string) => {
      const res = await fetchJson<any>(`/web-frontend/ads${location ? `?location=${location}` : ''}`);
      return Array.isArray(res) ? res : res?.data ?? [];
    },
  },

  // --- User ---
  user: {
    getCurrent: async () => {
      const res = await fetchJson<any>('/profile');
      // Backend returns { success: true, data: { user: {...}, profile: {...} } }
      const data = res?.data || res;
      const user = data?.user || data;

      // Merge profile into user if it exists and isn't already there
      if (data?.profile && !user.profile) {
        user.profile = data.profile;
      }

      return user as User;
    },
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
      '/onboarding/step2',
      { method: 'POST', body: JSON.stringify(data) }
    ),
    getOnboardingProfile: () => fetchJson<any>('/onboarding/profile'),
  },

  // --- Settings ---
  settings: {
    getPublic: async (): Promise<{ vat_percentage: number }> => {
      const res = await fetchJson<any>('/settings');
      return res?.data ?? res;
    }
  },
};

export default api;