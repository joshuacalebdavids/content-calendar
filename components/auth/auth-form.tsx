"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, LockKey } from "@phosphor-icons/react";
import { BrandMark } from "@/components/brand-mark";
import type { AuthActionState } from "@/app/auth/sign-in/actions";

type AuthAction = (
  previousState: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

export function AuthForm({ mode, action }: { mode: "sign-in" | "sign-up"; action: AuthAction }) {
  const [state, formAction, isPending] = useActionState(action, null);
  const isSignIn = mode === "sign-in";

  return (
    <main className="auth-page" id="main-content">
      <header className="auth-page-header">
        <BrandMark />
        <Link href="/">Back to home</Link>
      </header>

      <section className="auth-layout" aria-labelledby="auth-title">
        <div className="auth-intro">
          <span className="auth-index">Calio workspace / 01</span>
          <div>
            <span className="auth-icon" aria-hidden="true"><LockKey size={18} weight="light" /></span>
            <h1 id="auth-title">{isSignIn ? "Welcome back." : "Create your workspace."}</h1>
            <p>{isSignIn ? "Sign in to continue planning, shaping, and publishing." : "Start with a secure workspace for your content system."}</p>
          </div>
        </div>

        <div className="auth-form-shell">
          <form action={formAction} className="auth-form">
            {!isSignIn && (
              <label>
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
              </label>
            )}
            <label>
              <span>Email address</span>
              <input name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" autoComplete={isSignIn ? "current-password" : "new-password"} minLength={8} required placeholder="At least 8 characters" />
            </label>

            {state?.error && <p className="auth-error" role="alert">{state.error}</p>}

            <button className="auth-submit" type="submit" disabled={isPending}>
              <span>{isPending ? "Please wait…" : isSignIn ? "Sign in" : "Create account"}</span>
              <span aria-hidden="true"><ArrowRight size={16} weight="light" /></span>
            </button>
          </form>

          <p className="auth-switch">
            {isSignIn ? "New to Calio?" : "Already have an account?"}{" "}
            <Link href={isSignIn ? "/auth/sign-up" : "/auth/sign-in"}>{isSignIn ? "Create an account" : "Sign in"}</Link>
          </p>
          <p className="auth-security">Authentication is securely managed by Neon Auth.</p>
        </div>
      </section>
    </main>
  );
}
