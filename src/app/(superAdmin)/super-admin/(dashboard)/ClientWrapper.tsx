"use client";

import React, {  useState } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/lib/axios";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const router = useRouter();

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["auth-check"],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get("/auth/check-auth");
  //     return res.data;
  //   },
  //   retry: false,
  // });

  // useEffect(() => {
  //   if (error || data?.success === false) {
  //     router.replace("/login");
  //   }
  // }, [data, error, router]);

  // if (isLoading) {
  //   return <div className="p-6 text-center">Checking authentication...</div>;
  // }

  return (
    <div className="flex">
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-[60px]" : "ml-[250px]"
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
