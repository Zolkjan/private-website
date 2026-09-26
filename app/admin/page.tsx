"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Fingerprint, LockKeyhole } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/components/admin/AdminShell";
import { auth, isFirebaseConfigured, adminUid } from "@/lib/firebase";

export default function AdminLoginPage() {
  const { loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) return;
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (loginError) {
      setError(getLoginError(loginError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#080c0e] px-5 py-12 text-[#e6f7fb] [background-image:radial-gradient(ellipse_at_50%_0%,rgba(4,178,217,0.12),transparent_48%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#04b2d9]/60 to-transparent" />
      <div className="relative z-10 w-full max-w-[440px]">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[#9bb6c1] transition-colors hover:text-[#05dbf2]">
          <ArrowLeft size={15} /> Powrót na stronę
        </Link>

        <Card className="gap-0 overflow-hidden border-[#22363c] bg-[#0d1315]/95 shadow-[0_24px_90px_rgba(0,0,0,0.4)]">
          <CardHeader className="gap-5 px-7 pb-6 pt-8 sm:px-9 sm:pt-9">
            <div className="flex size-12 items-center justify-center border border-[#04b2d9]/30 bg-[#04b2d9]/10 text-[#05dbf2]">
              <Fingerprint size={22} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#04b2d9]">CreativePath / Admin</p>
              <CardTitle className="text-3xl font-bold tracking-normal">Panel właściciela</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-[#9bb6c1]">
                Zaloguj się, aby zarządzać projektami i treściami strony.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-7 pb-8 sm:px-9 sm:pb-9">
            {!isFirebaseConfigured || !adminUid ? (
              <div role="alert" className="border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-100">
                Brakuje konfiguracji Firebase. Uzupełnij zmienne `NEXT_PUBLIC_FIREBASE_*` i `NEXT_PUBLIC_FIREBASE_ADMIN_UID` w `.env.local`.
              </div>
            ) : loading ? (
              <p role="status" className="py-5 text-sm text-[#9bb6c1]">Sprawdzanie sesji...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-xs uppercase tracking-[0.14em] text-[#b6cbd1]">Adres e-mail</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="jan@example.com"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 border-[#2a3b40] bg-[#090e10] focus-visible:border-[#04b2d9] focus-visible:ring-[#04b2d9]/30"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="admin-password" className="text-xs uppercase tracking-[0.14em] text-[#b6cbd1]">Hasło</Label>
                    <LockKeyhole size={14} className="text-[#60777e]" />
                  </div>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 border-[#2a3b40] bg-[#090e10] focus-visible:border-[#04b2d9] focus-visible:ring-[#04b2d9]/30"
                  />
                </div>
                {error && <p role="alert" className="border border-rose-500/30 bg-rose-500/5 px-3 py-2.5 text-sm text-rose-200">{error}</p>}
                <Button type="submit" disabled={submitting} className="h-11 w-full font-semibold uppercase tracking-[0.14em]">
                  {submitting ? "Logowanie..." : "Zaloguj się"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-[11px] tracking-wide text-[#60777e]">
          Dostęp ograniczony do konta administratora.
        </p>
      </div>
    </main>
  );
}

function getLoginError(error: unknown) {
  const code = (error as { code?: string }).code;
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Nieprawidłowy adres e-mail lub hasło.";
  }
  if (code === "auth/too-many-requests") {
    return "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.";
  }
  if (code === "auth/network-request-failed") {
    return "Brak połączenia z Firebase. Sprawdź internet i spróbuj ponownie.";
  }
  return "Nie udało się zalogować. Sprawdź dane i konfigurację Firebase.";
}