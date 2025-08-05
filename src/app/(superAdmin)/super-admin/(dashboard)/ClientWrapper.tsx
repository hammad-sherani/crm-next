"use client";

import React, { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import useAuthStore from "@/store/auth.store";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { setUser } = useAuthStore()



  React.useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/check-auth", {
        credentials: "include", 
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data?.user);
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, [setUser]);

  return (
    <div className="flex">
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      <main
        className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "ml-[60px]" : "ml-[250px]"
          } w-full bg-background min-h-screen`}
      >
        <Header
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className="p-6 bg-black/20 min-h-screen mt-14">{children}</div>
      </main>
    </div>
  );
}
