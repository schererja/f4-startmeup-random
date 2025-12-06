"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-amber-600/30 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo/Title */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-amber-100 transition hover:text-amber-50 sm:text-2xl">
            <span className="text-amber-500">◆</span>{" "}
            <span className="hidden sm:inline">Fallout 4: Start Me Up</span>
            <span className="sm:hidden">F4: Start Me Up</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
            >
              Dashboard
            </Link>
            <Link
              href="/characters"
              className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
            >
              Characters
            </Link>
            <Link
              href="/traits"
              className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
            >
              Traits
            </Link>
            <Link
              href="/jobs"
              className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
            >
              Jobs
            </Link>
            <Link
              href="/locations"
              className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
            >
              Locations
            </Link>
            <Link
              href="/specials"
              className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
            >
              Specials
            </Link>
          </SignedIn>
          <SignedIn>
            <div className="border-l border-amber-600/30 pl-8">
              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-amber-600/30 bg-slate-800 p-2 transition hover:border-amber-600/50"
              aria-label="Toggle menu"
            >
              <span
                className={`h-0.5 w-6 bg-amber-100 transition-all ${
                  mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-amber-100 transition-all ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-amber-100 transition-all ${
                  mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <SignedIn>
          <div className="border-t border-amber-600/30 bg-slate-900 md:hidden">
            <div className="flex flex-col space-y-1 px-4 py-3">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-amber-100 transition hover:bg-amber-600/20 hover:text-amber-50"
              >
                Dashboard
              </Link>
              <Link
                href="/characters"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-amber-100 transition hover:bg-amber-600/20 hover:text-amber-50"
              >
                Characters
              </Link>
              <Link
                href="/traits"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-amber-100 transition hover:bg-amber-600/20 hover:text-amber-50"
              >
                Traits
              </Link>
              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-amber-100 transition hover:bg-amber-600/20 hover:text-amber-50"
              >
                Jobs
              </Link>
              <Link
                href="/locations"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-amber-100 transition hover:bg-amber-600/20 hover:text-amber-50"
              >
                Locations
              </Link>
              <Link
                href="/specials"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-amber-100 transition hover:bg-amber-600/20 hover:text-amber-50"
              >
                Specials
              </Link>
            </div>
          </div>
        </SignedIn>
      )}
    </nav>
  );
}
