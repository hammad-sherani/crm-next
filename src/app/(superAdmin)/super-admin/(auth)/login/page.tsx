// app/super-admin/login/page.tsx
import React from "react";
import LoginForm from "./LoginForm";

export default function SuperAdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-sm p-6 bg-muted border border-border rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Super Admin Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
