"use client";

import { useState } from "react";
import { Mail, Lock, Loader2, FileText, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function FullscreenAuth() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signIn = useAppStore((state) => state.signIn);
  const signUp = useAppStore((state) => state.signUp);

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
        toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        setMode("signin");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Une erreur est survenue lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      {/* Auth Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        {/* App Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Bienvenue sur appFacture
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Veuillez vous connecter ou créer un compte pour accéder à votre espace de facturation.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode Switch tabs */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 gap-0.5 border border-slate-200/50 dark:border-slate-800/50">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={cn(
                "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                mode === "signin"
                  ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
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
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
              )}
            >
              Créer un compte
            </button>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
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
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              Mot de passe
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-2.5 pl-10 pr-10 text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {mode === "signup" && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-2.5 pl-10 pr-10 text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 transition-colors"
                  title={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-750 focus:outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
            En continuant, vous acceptez les conditions d&apos;utilisation de l&apos;application appFacture.
          </p>
        </form>
      </div>
    </div>
  );
}
