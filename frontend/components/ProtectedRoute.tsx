"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "@/lib/auth";

/**
 * Higher Order Component to protect routes.
 * Verifies session with the backend using /api/me/.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const user = await checkAuthStatus();
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/signin");
        }
      } catch {
        setIsAuthenticated(false);
        router.replace("/signin");
      }
    }
    verifyAuth();
  }, [router]);

  // Prevent flash of content
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
