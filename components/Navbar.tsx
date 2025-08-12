"use client";

import Link from "next/link";
import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/auth.actions";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import { toast } from "sonner";

type NavbarProps = {
  user: { id: string; email: string; name: string } | null;
};

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const initialState = {
    success: false,
    message: "",
  };

  // ✅ Correct useActionState usage
  const [state, formAction] = useActionState(logoutUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Logout successful");
      router.push("/login");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <header className="border-b shadow-sm relative z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex gap-8">
          <ThemeSwitcher />
          <h1 className="text-xl font-bold tracking-wide">🌊 Sea Safetly</h1>
        </div>
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-6 items-center">
          <Link href="/">Dashboard</Link>
          <Link href="/psychology">Psychological Help</Link>
          <Link href="/admin">Admin</Link>
          {user ? (
            <>
              <Link href="/tutorials">Tutorials</Link>
              <Link href="/materials">Materials</Link>
              <form action={formAction}>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-6 text-xl font-medium z-40 transition-all">
          <Link href="/" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link href="/psychology" onClick={() => setIsOpen(false)}>
            Psychological Help
          </Link>
          <Link href="/admin" onClick={() => setIsOpen(false)}>
            Admin
          </Link>

          {user ? (
            <>
              <Link href="/tutorials" onClick={() => setIsOpen(false)}>
                Tutorials
              </Link>
              <Link href="/materials" onClick={() => setIsOpen(false)}>
                Materials
              </Link>
              <form action={formAction}>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 w-[100px] text-white text-center px-2 py-1 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="bg-red-600 w-[100px] text-white text-center px-2 py-1 rounded hover:bg-red-700 transition"
              >
                Register
              </Link>
            </>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6"
          >
            <X size={28} />
          </button>
        </div>
      )}
    </header>
  );
}
