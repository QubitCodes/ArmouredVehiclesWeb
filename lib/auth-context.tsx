'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, getStoredUser, clearTokens, getAccessToken } from './api';
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

        if (storedUser && token) {
          setUser(storedUser);
          // Optionally verify token with backend
          try {
            const freshUser = await api.auth.me();
            setUser(freshUser);
          } catch {
            // Token might be expired, will be refreshed on next API call
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

      if (user) {
          // Check if onboarding is incomplete
           // Note: API returns onboardingStep via user object if it was added. 
           // Need to make sure User type has it or we cast it.
           // Assuming onboarding_step is the DB field name, api.ts maps it?
           // Let's check 'user' object structure. Usually it matches API response.
           
           const onboardingStep = (user as any).onboarding_step ?? (user as any).onboardingStep;
           
           if (onboardingStep && onboardingStep > 0 && onboardingStep < 5) {
               // User needs to complete onboarding
               
               // Allowed paths for incomplete users:
               // 1. /buyer-onboarding (and its subpaths if any)
               // 2. /logout (handled via button usually)
               // 3. /login (to switch account)
               
               if (!pathname.startsWith('/buyer-onboarding') && 
                   !pathname.startsWith('/login') && 
                   !pathname.startsWith('/register') &&
                   !pathname.startsWith('/contact')) {  
                   
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
      await api.auth.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await api.auth.me();
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

