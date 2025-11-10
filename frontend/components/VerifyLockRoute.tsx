"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Protects the /verify-2fa page.
 * Allows access only if 'pending_verification' flag exists in localStorage.
 */
export default function VerifyLockRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const pendingVerification = localStorage.getItem("pending_verification");

    if (!pendingVerification) {
      // user directly visiting without signup — redirect
      router.replace("/signin");
    } else {
      setAllowed(true);
    }
  }, [router]);

  if (allowed === null) return null; // Optional loading spinner can go here

  return <>{children}</>;
}
