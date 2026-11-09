import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { auth } from "@/lib/auth/server";
import { signUpWithEmail } from "./actions";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your secure Calio workspace account.",
};

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const { data: session } = await auth.getSession();
  if (session?.user) redirect("/demo");
  return <AuthForm mode="sign-up" action={signUpWithEmail} />;
}
