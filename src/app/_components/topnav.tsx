"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const FO4_LINKS = [
  { href: "/fallout4/dashboard", label: "Dashboard" },
  { href: "/fallout4/characters", label: "Characters" },
  { href: "/fallout4/traits", label: "Traits" },
  { href: "/fallout4/jobs", label: "Jobs" },
  { href: "/fallout4/locations", label: "Locations" },
  { href: "/fallout4/specials", label: "Specials" },
];

const D2_LINKS = [{ href: "/diablo2/characters", label: "Characters" }];

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isD2 = pathname.startsWith("/diablo2");
  const isFO4 =
    pathname.startsWith("/fallout4") ||
    pathname.startsWith("/characters") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/traits") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/locations") ||
    pathname.startsWith("/specials");

  const navLinks = isD2 ? D2_LINKS : isFO4 ? FO4_LINKS : [];
  const gameLabel = isD2 ? "Diablo II" : isFO4 ? "Fallout 4" : "Start Me Up";
  const switchTarget = isD2 ? "/fallout4/characters" : "/diablo2/characters";
  const switchLabel = isD2 ? "Switch to FO4" : "Switch to D2";
  const showSwitcher = isFO4 || isD2;

  return (
    <nav className="border-b border-amber-600/30 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-amber-100 transition hover:text-amber-50 sm:text-2xl">
            <span className="text-amber-500">◆</span>{" "}
            <span className="hidden sm:inline">{gameLabel}</span>
            <span className="sm:hidden">SMU</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
              >
                {link.label}
              </Link>
            ))}
            {showSwitcher && (
              <Link
                href={switchTarget}
                className="rounded border border-amber-600/50 px-3 py-1 text-sm text-amber-300 transition hover:border-amber-500 hover:text-amber-100"
              >
                {switchLabel}
              </Link>
            )}
          </SignedIn>
          <SignedIn>
            <div className="border-l border-amber-600/30 pl-6">
              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* Mobile */}
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
                className={`h-0.5 w-6 bg-amber-100 transition-all ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-amber-100 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-amber-100 transition-all ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </SignedIn>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <SignedIn>
          <div className="border-t border-amber-600/30 bg-slate-900 md:hidden">
            <div className="flex flex-col space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded px-3 py-2 text-amber-100 transition hover:bg-amber-600/20 hover:text-amber-50"
                >
                  {link.label}
                </Link>
              ))}
              {showSwitcher && (
                <Link
                  href={switchTarget}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded px-3 py-2 text-amber-300 transition hover:bg-amber-600/20"
                >
                  {switchLabel}
                </Link>
              )}
            </div>
          </div>
        </SignedIn>
      )}
    </nav>
  );
}

