import { Suspense } from "react";
import { adminTheme } from "@/components/admin/theme";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div style={adminTheme} className="admin-backdrop flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-2 text-center">SUNKOOL</p>
        <h1 className="headline mb-8 text-center text-3xl text-white">Admin sign in</h1>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
