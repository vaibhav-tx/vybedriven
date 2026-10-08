import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Navbar } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Choose New Password — Vybe Driven" }, { name: "description", content: "Choose a new password for your Vybe Driven account." }, { property: "og:title", content: "Choose New Password — Vybe Driven" }, { property: "og:description", content: "Secure your Vybe Driven account with a new password." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const result = await supabase.auth.updateUser({ password }); if (result.error) setError(result.error.message); else setMessage("Password updated. You can now continue to your account."); };
  return <div className="min-h-screen"><Navbar /><main className="mx-auto max-w-md px-6 py-20"><h1 className="text-3xl font-bold">Choose a new password</h1><p className="mt-3 text-sm text-muted-foreground">Use at least eight characters.</p><form onSubmit={submit} className="mt-8 space-y-4"><input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring" placeholder="New password" />{error && <p className="text-sm text-destructive">{error}</p>}{message && <p className="text-sm text-neon">{message}</p>}<Button className="h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground">Update password</Button></form>{message && <Link to="/profile" className="mt-6 block text-center text-sm font-semibold text-neon">Continue to profile</Link>}</main></div>;
}