"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { Field, Input, SaveButton } from "@/components/admin/form-controls";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await adminLogin(String(form.get("username")), String(form.get("password")));
      router.push("/admin");
    } catch {
      setError("Invalid credentials");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-heading text-2xl mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <Field label="Username">
          <Input name="username" required autoComplete="username" />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" required autoComplete="current-password" />
        </Field>
        {error && (
          <p role="alert" className="text-error text-sm mb-4">
            {error}
          </p>
        )}
        <SaveButton pending={pending} label="Log in" />
      </form>
    </div>
  );
}
