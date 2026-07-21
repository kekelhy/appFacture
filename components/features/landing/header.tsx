"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-350 border-b",
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 shadow-sm py-4"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="#" className="flex items-center gap-2 text-2xl font-black tracking-tight text-indigo-600 hover:scale-98 transition-all">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-headline-lg">
            appFacture
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Fonctionnalités
          </a>
          <a href="#pricing" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Tarifs
          </a>
          <a href="#blog" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Blog
          </a>
          <a href="#resources" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Ressources
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
          >
            Connexion
          </Link>
          <Link
            href="/dashboard"
            className="cta-primary bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 dark:text-slate-200 p-2 outline-none"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
            >
              Fonctionnalités
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
            >
              Tarifs
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
            >
              Blog
            </a>
            <a
              href="#resources"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
            >
              Ressources
            </a>
            <div className="h-px bg-slate-100 my-2" />
            <Link
              href="/dashboard"
              className="text-sm font-bold text-slate-600 py-2 text-center hover:bg-slate-50 rounded-xl"
            >
              Connexion
            </Link>
            <Link
              href="/dashboard"
              className="w-full text-center bg-indigo-600 text-white text-xs font-bold py-3 rounded-full hover:bg-indigo-700 transition-all shadow-md"
            >
              Commencer gratuitement
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
