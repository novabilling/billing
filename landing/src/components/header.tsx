"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap, Github } from "lucide-react";
import clsx from "clsx";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:4002";
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:4003";
const API_REF_URL =
  process.env.NEXT_PUBLIC_API_REF_URL || "http://localhost:4000/api/reference";

const GITHUB_URL = "https://github.com/novabilling/billing";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: DOCS_URL, external: true },
  { label: "API Reference", href: API_REF_URL, external: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <Zap className="h-5 w-5" />
          </span>
          <span>
            Nova<span className="text-[var(--primary)]">Billing</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={DASHBOARD_URL}
            className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            Sign In
          </a>
          <a
            href={DASHBOARD_URL}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--primary-light)]"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[var(--muted)] hover:text-[var(--fg)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "md:hidden overflow-hidden border-t border-[var(--border)] transition-all duration-300",
          mobileOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          <hr className="my-2 border-[var(--border)]" />
          <a
            href={DASHBOARD_URL}
            className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
            onClick={() => setMobileOpen(false)}
          >
            Sign In
          </a>
          <a
            href={DASHBOARD_URL}
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--primary-light)]"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}
