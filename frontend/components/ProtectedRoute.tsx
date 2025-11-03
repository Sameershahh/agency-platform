"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (!access || !refresh) {
      router.replace("/signin");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (isAuth === null) return null; // optional loader could go here

  return <>{children}</>;
}
