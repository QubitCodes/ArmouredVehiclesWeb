'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, getStoredUser, clearTokens, getAccessToken, syncAuthCookie } from './api';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, userType?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that can be accessed without auth or during restricted onboarding
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/otp-login',
  '/verify-email',
  '/verify-phone',
  '/',
  '/contact',
  '/privacy-policy',
  '/product', // allow viewing products?
  '/products'
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const token = getAccessToken();

        if (token) {
          // Optimistically set user from storage if available
          if (storedUser) {
            setUser(storedUser);
          }

          // Verify token and get fresh user data
          try {
            const freshUser = await api.user.getCurrent();
            setUser(freshUser);
            // Update storage with fresh data
            import('./api').then(m => m.storeUser(freshUser));
          } catch (err) {
            console.error('Failed to fetch user profile with token:', err);
            // If we had a stored user but the token is invalid, we should probably log out
            // But let's check if it's just a network error vs 401
            // For now, if fetch fails and we have no stored user, we are definitely not logged in.
            if (!storedUser) {
              clearTokens();
            }
            // If we have a stored user, we might keep them logged in optimistically or force logout?
            // Usually 401 causes a redirect in api.ts anyway.
          }

          // Ensure cookie is synced for Middleware
          syncAuthCookie();
        } else {
          // No token, ensure clean state
          if (storedUser) {
            clearTokens();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Persistent Onboarding Redirection Middleware
  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    // Skip checks for public routes
    // But be careful: Some public routes are also destinations (e.g. /register, /login)
    // We want to force logged-in users out of these flows into the correction flow, 
    // EXCEPT if they are explicitly logging out or in the middle of the correction.

    if (user) {
      // 1. Phone Verification Check
      if (!user.phone_verified) {
        // Allow access to: /add-phone, /verify-phone, /logout
        const isPhoneRoute = pathname.startsWith('/add-phone') || pathname.startsWith('/verify-phone');

        if (!pathname.startsWith('/logout') && !isPhoneRoute) {
          // If phone is missing (null, undefined, or empty string after trim), go to add-phone
          // We check for length < 3 (min country code length usually) to be safe against garbage like "+"
          if (!user.phone || user.phone.trim().length < 3) {
            console.log(`[AuthMiddleware] Redirecting to /add-phone (Phone missing or invalid). User Phone Value: '${user.phone}'`);
            router.replace('/add-phone');
          } else {
            // If phone exists but not verified, go to verify-phone
            console.log(`[AuthMiddleware] Redirecting to /verify-phone (Phone exists but unverified). User:`, JSON.stringify(user));
            router.replace('/verify-phone');
          }
        }
        // CRITICAL FIX: Stop execution here if we are dealing with phone verification
        // This prevents falling through to 'Profile Existence Check' which redirects to /create-account
        // causing a loop.
        return;
      }

      // 2. Profile Existence/Creation Check (Step 0)
      // Determining if profile exists depends on how API returns it.
      // Usually checking onboarding_step is safer. If step is undefined/null, maybe profile is missing?
      // Or if onboarding_step === 0.
      const onboardingStep = (user as any).onboarding_step ?? (user as any).onboardingStep;

      if (onboardingStep === 0) {
        // Allow access to: /create-account, /buyer-onboarding, /logout
        if (!pathname.startsWith('/create-account') &&
          !pathname.startsWith('/buyer-onboarding') &&
          !pathname.startsWith('/logout')) {
          console.log(`[AuthMiddleware] Redirecting to /create-account. User State:`, { step: onboardingStep, verified: user.phone_verified });
          router.replace('/create-account');
        }
        return; // Stop checks
      }

      // 3. Onboarding Completion Check (Steps 1-4)
      if (onboardingStep && onboardingStep > 0 && onboardingStep < 5) {
        // User needs to complete onboarding
        // Allowed paths: /buyer-onboarding, /seller-onboarding (if applicable), /logout

        if (!pathname.startsWith('/buyer-onboarding') &&
          !pathname.startsWith('/seller-onboarding') &&
          !pathname.startsWith('/logout')) {

          console.log(`[AuthMiddleware] Redirecting incomplete user from ${pathname} to /buyer-onboarding`);
          router.replace(`/buyer-onboarding/step/${onboardingStep}`);
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(email, password);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, userType: string = 'customer') => {
    setIsLoading(true);
    try {
      const response = await api.auth.register(name, email, password, userType);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          await api.auth.logout(refreshToken);
        } catch (e) {
          console.error("Logout API failed", e);
        }
      }
    } finally {
      // Clear local state regardless of API success
      clearTokens();
      setUser(null);
      setIsLoading(false);
      // Optional: redirect to login
      router.push('/login');
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await api.user.getCurrent();
      setUser(freshUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

