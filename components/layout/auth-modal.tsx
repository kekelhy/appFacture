"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = useAppStore((state) => state.signIn);
  const signUp = useAppStore((state) => state.signUp);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        toast.success("Connexion réussie !");
      } else {
        await signUp(email, password);
        toast.success("Inscription réussie ! Un e-mail de confirmation a été envoyé.");
      }
      onClose();
      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Une erreur est survenue lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {mode === "signin" ? "Se connecter" : "Créer un compte"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mode Switch tabs */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 gap-0.5 border border-slate-200/50 dark:border-slate-800/50">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={cn(
                "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                mode === "signin"
                  ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400"
                  : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                mode === "signup"
                  ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400"
                  : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              Inscription
            </button>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Adresse E-mail
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Mot de passe
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all"
              />
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {mode === "signup" && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authentification...
              </>
            ) : mode === "signin" ? (
              "Se connecter"
            ) : (
              "Créer un compte"
            )}
          </button>

          {/* Helper links */}
          <p className="text-[11px] text-center text-slate-400 mt-4 leading-normal">
            En continuant, vous acceptez les conditions d&apos;utilisation de l&apos;application proFacture.
          </p>
        </form>
      </div>
    </div>
  );
}
