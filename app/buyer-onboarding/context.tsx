"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import API from "@/lib/api";

interface OnboardingContextType {
  profileData: any;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.vendor.getOnboardingProfile();
      // API returns standard response wrapper { status: true, data: { profile, user } }
      // Check both locations just in case
      const data = res?.data || res;
      const profile = data?.profile || {};
      const userData = data?.user || {};
      setProfileData({ ...profile, ...userData });
    } catch (err) {
      console.error("Failed to fetch onboarding profile", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <OnboardingContext.Provider value={{ profileData, loading, refreshProfile: fetchProfile }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
