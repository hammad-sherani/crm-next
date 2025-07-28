// app/super-admin/layout.tsx
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import client layout
const ClientWrapper = dynamic(() => import("./ClientWrapper"));

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
