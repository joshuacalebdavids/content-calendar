import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { auth } from "@/lib/auth/server";
import { signInWithEmail } from "./actions";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Calio workspace.",
};

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const { data: session } = await auth.getSession();
  if (session?.user) redirect("/demo");
  return <AuthForm mode="sign-in" action={signInWithEmail} />;
}
