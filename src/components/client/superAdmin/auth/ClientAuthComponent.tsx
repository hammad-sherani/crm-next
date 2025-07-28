"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth.store";

export default function ClientAuthComponent() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role.toLowerCase() === "super_admin") {
      router.replace("/super-admin/dashboard");
    }
  }, [user, router]);

  return null;
}
