"use client";

import Link from "next/link";
import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/auth.actions";
import { Menu, X, User } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import { toast } from "sonner";

type NavbarProps = {
  user: { id: string; email: string; name: string } | null;
};

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const initialState = { success: false, message: "" };
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
        {/* Left side */}
        <div className="flex gap-8 items-center">
          <ThemeSwitcher />
          <h1 className="text-xl font-bold tracking-wide">🌊 Sea Safetly</h1>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-6 items-center">
          <Link href="/" className="hover:text-yellow-600">
            Dashboard
          </Link>
          <Link href="/psychology" className="hover:text-yellow-600">
            Psychological Help
          </Link>
          <Link href="/admin" className="hover:text-yellow-600">
            Admin
          </Link>

          {user ? (
            <>
              <Link href="/tutorials" className="hover:text-yellow-600">
                Tutorials
              </Link>
              <Link href="/materials" className="hover:text-yellow-600">
                Materials
              </Link>

              {/* Show user name */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-md border-l-1 border-r-1">
                <User size={18} className="text-blue-400" />
                <span className="font-medium ">{user.name || user.email}</span>
                {/* Logout button */}
                <form action={formAction}>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    Logout
                  </button>
                </form>
              </div>
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
        <div className="fixed inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-6 text-xl font-medium z-40 transition-all">
          <Link
            href="/"
            className="hover:text-yellow-600"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/psychology"
            className="hover:text-yellow-600"
            onClick={() => setIsOpen(false)}
          >
            Psychological Help
          </Link>
          <Link
            href="/admin"
            className="hover:text-yellow-600"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>

          {user ? (
            <>
              <Link
                href="/tutorials"
                className="hover:text-yellow-600"
                onClick={() => setIsOpen(false)}
              >
                Tutorials
              </Link>
              <Link
                href="/materials"
                className="hover:text-yellow-600"
                onClick={() => setIsOpen(false)}
              >
                Materials
              </Link>

              {/* Show user name on mobile */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-md border-l-1 border-r-1">
                <User size={20} className="text-blue-400 " />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {user.name || user.email}
                </span>
                <form action={formAction} onSubmit={() => setIsOpen(false)}>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    Logout
                  </button>
                </form>
              </div>
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
