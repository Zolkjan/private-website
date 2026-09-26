"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, FolderKanban, Layers3, LogOut, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, adminUid, db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { technologyDictionary } from "@/lib/technologies";

interface AdminAuthState {
  user: User | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthState>({
  user: null,
  loading: true,
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === "/admin";

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.uid !== adminUid || !db) return;
    const firestore = db;
    let cancelled = false;
    const seedTechnologyDictionary = async () => {
      try {
        const existing = await getDocs(collection(firestore, "technologies"));
        if (cancelled || !existing.empty) return;
        await Promise.all(
          technologyDictionary.map((technology) => {
            const id = technology.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return setDoc(doc(firestore, "technologies", id), technology);
          }),
        );
      } catch {
        if (!cancelled) {
          console.warn("Nie udało się zainicjować słownika technologii. Sprawdź reguły Firestore.");
        }
      }
    };
    void seedTechnologyDictionary();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (user?.uid === adminUid) {
      if (isLoginRoute) router.replace("/admin/projects");
    } else if (!isLoginRoute) {
      router.replace("/admin");
    }
  }, [isLoginRoute, loading, router, user]);

  const authState = { user, loading };

  if (loading) {
    return (
      <AdminAuthContext.Provider value={authState}>
        <AdminStatus>Sprawdzanie dostępu...</AdminStatus>
      </AdminAuthContext.Provider>
    );
  }

  if (!user && isLoginRoute) {
    return (
      <AdminAuthContext.Provider value={authState}>
        {children}
      </AdminAuthContext.Provider>
    );
  }

  if (user && user.uid !== adminUid) {
    return (
      <AdminAuthContext.Provider value={authState}>
        <main className="grid min-h-screen place-items-center bg-[#080c0e] px-5 text-[#e6f7fb]">
          <div className="max-w-md text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-rose-300">
              Brak uprawnień
            </p>
            <h1 className="mb-3 text-3xl font-bold">To konto nie jest administratorem</h1>
            <p className="mb-7 text-sm leading-relaxed text-[#9bb6c1]">
              Zaloguj się kontem przypisanym do panelu.
            </p>
            <Button variant="outline" onClick={() => auth && signOut(auth)}>
              <LogOut /> Wyloguj
            </Button>
          </div>
        </main>
      </AdminAuthContext.Provider>
    );
  }

  if (!user) {
    return (
      <AdminAuthContext.Provider value={authState}>
        <AdminStatus>Przekierowanie do logowania...</AdminStatus>
      </AdminAuthContext.Provider>
    );
  }

  return (
    <AdminAuthContext.Provider value={authState}>
      <div className="min-h-screen bg-[#080c0e] text-[#e6f7fb]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#1c2a2e] bg-[#0b1012] px-5 py-7 lg:flex">
          <Link href="/admin/projects" className="mb-12 block px-3">
            <span className="block text-[10px] uppercase tracking-[0.28em] text-[#04b2d9]">
              CreativePath
            </span>
            <span className="mt-2 block text-lg font-bold">Admin</span>
          </Link>
          <nav className="space-y-2" aria-label="Panel administracyjny">
            <AdminNavLink href="/admin/projects" active={pathname === "/admin/projects"}>
              <FolderKanban /> Projekty
            </AdminNavLink>
            <AdminNavLink href="/admin/projects/new" active={pathname === "/admin/projects/new"}>
              <Plus /> Dodaj projekt
            </AdminNavLink>
            <AdminNavLink href="/admin/content" active={pathname === "/admin/content"}>
              <FileText /> Treści strony
            </AdminNavLink>
            <AdminNavLink href="/admin/profile" active={pathname === "/admin/profile"}>
              <UserRound /> Dane profilowe
            </AdminNavLink>
            <AdminNavLink href="/admin/technologies" active={pathname === "/admin/technologies"}>
              <Layers3 /> Technologie
            </AdminNavLink>
          </nav>
          <div className="mt-auto space-y-3 border-t border-[#1c2a2e] pt-5">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-[#9bb6c1] transition-colors hover:text-[#05dbf2]">
              <ArrowLeft size={16} /> Wróć na stronę
            </Link>
            <Button variant="ghost" className="w-full justify-start text-[#9bb6c1]" onClick={() => auth && signOut(auth)}>
              <LogOut /> Wyloguj się
            </Button>
          </div>
        </aside>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 border-b border-[#1c2a2e] bg-[#080c0e]/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <Link href="/admin/projects" className="lg:hidden">
                <span className="block text-[10px] uppercase tracking-[0.22em] text-[#04b2d9]">CreativePath</span>
                <span className="text-sm font-semibold">Panel admina</span>
              </Link>
              <nav className="flex items-center gap-1 lg:hidden" aria-label="Panel administracyjny">
                <MobileAdminLink href="/admin/projects" active={pathname === "/admin/projects"}>Projekty</MobileAdminLink>
                <MobileAdminLink href="/admin/projects/new" active={pathname === "/admin/projects/new"}>Dodaj</MobileAdminLink>
                <MobileAdminLink href="/admin/content" active={pathname === "/admin/content"}>Treści</MobileAdminLink>
                <MobileAdminLink href="/admin/profile" active={pathname === "/admin/profile"}>Profil</MobileAdminLink>
                <MobileAdminLink href="/admin/technologies" active={pathname === "/admin/technologies"}>Technologie</MobileAdminLink>
              </nav>
              <span className="hidden truncate text-sm text-[#9bb6c1] sm:block">{user.email}</span>
              <Button variant="ghost" size="icon" className="shrink-0 text-[#9bb6c1] lg:hidden" aria-label="Wyloguj się" onClick={() => auth && signOut(auth)}>
                <LogOut />
              </Button>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}

function AdminNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors [&_svg]:size-4",
        active
          ? "bg-[#103039] text-[#63dff2]"
          : "text-[#9bb6c1] hover:bg-[#111b1e] hover:text-[#e6f7fb]",
      )}
    >
      {children}
    </Link>
  );
}

function MobileAdminLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded px-2 py-2 text-xs",
        active ? "text-[#05dbf2]" : "text-[#9bb6c1]",
      )}
    >
      {children}
    </Link>
  );
}

function AdminStatus({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080c0e] px-5 text-sm text-[#9bb6c1]">
      <p role="status">{children}</p>
    </main>
  );
}