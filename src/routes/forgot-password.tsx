import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Navbar } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Password — Vybe Driven" }, { name: "description", content: "Request a secure Vybe Driven password reset link." }, { property: "og:title", content: "Reset Password — Vybe Driven" }, { property: "og:description", content: "Request a secure password reset link." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(""); const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (result.error) setError(result.error.message); else setMessage("Check your email for a secure reset link."); };
  return <div className="min-h-screen"><Navbar /><main className="mx-auto max-w-md px-6 py-20"><h1 className="text-3xl font-bold">Reset your password</h1><p className="mt-3 text-sm text-muted-foreground">Enter your account email and we’ll send you a secure reset link.</p><form onSubmit={submit} className="mt-8 space-y-4"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring" />{error && <p className="text-sm text-destructive">{error}</p>}{message && <p className="text-sm text-neon">{message}</p>}<Button className="h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground">Send reset link</Button></form><Link to="/auth" search={{ mode: "signin", next: "/" }} className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">Return to sign in</Link></main></div>;
}