"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
        <nav className="hidden lg:flex gap-6 items-center">
          <Link href="/">Dashboard</Link>
          <Link href="/tutorials">Tutorials</Link>
          <Link href="/psychology">Psychological Help</Link>
          <Link href="/materials">Materials</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>

      {/* Fullscreen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-6 text-xl font-medium z-40 transition-all">
          {/* <ThemeSwitcher /> */}
          <Link href="/" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link href="/tutorials" onClick={() => setIsOpen(false)}>
            Tutorials
          </Link>
          <Link href="/psychology" onClick={() => setIsOpen(false)}>
            Psychological Help
          </Link>
          <Link href="/materials" onClick={() => setIsOpen(false)}>
            Materials
          </Link>
          <Link href="/admin" onClick={() => setIsOpen(false)}>
            Admin
          </Link>
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
