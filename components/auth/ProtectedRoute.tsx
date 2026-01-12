"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProtectedRoute({ children, redirectTo }: { children: ReactNode; redirectTo?: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (redirectTo) {
        router.replace(redirectTo);
      } else {
        const next = encodeURIComponent(pathname || "/");
        router.replace(`/login?next=${next}`);
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16 text-[#737373]">
        Checking your session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
