"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import type { AuthActionState } from "../sign-in/actions";

export async function signUpWithEmail(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) return { error: "Complete every field to continue." };
  if (password.length < 8) return { error: "Use a password with at least 8 characters." };

  try {
    const { error } = await auth.signUp.email({ name, email, password });
    if (error) return { error: error.message || "We could not create your account." };
  } catch {
    return { error: "The account service is temporarily unavailable. Try again." };
  }

  redirect("/demo");
}
