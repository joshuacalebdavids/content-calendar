"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export type AuthActionState = { error: string } | null;

export async function signInWithEmail(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email address and password." };

  try {
    const { error } = await auth.signIn.email({ email, password });
    if (error) return { error: error.message || "We could not sign you in." };
  } catch {
    return { error: "The sign-in service is temporarily unavailable. Try again." };
  }

  redirect("/demo");
}
