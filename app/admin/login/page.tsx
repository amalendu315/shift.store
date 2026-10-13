"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@shiftstore.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid credentials");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 border border-[#e7e1d6] rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#f0ece1] text-[#b48849] rounded-full flex items-center justify-center mx-auto border border-[#e7e1d6]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#141412]">
            ShiftStore Admin Portal
          </h1>
          <p className="text-xs text-[#6b6963]">
            Festive Operations & Order Fulfillment Console
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#6b6963]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#e7e1d6] rounded-lg text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                placeholder="admin@shiftstore.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#6b6963]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#e7e1d6] rounded-lg text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                placeholder="Enter admin password (Default: PujaSale2026!)"
              />
            </div>
            <p className="text-[11px] text-[#6b6963] mt-1">
              Default Seed Password:{" "}
              <code className="font-mono bg-[#f0ece1] px-1 py-0.5 rounded">
                PujaSale2026!
              </code>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-medium text-xs flex items-center justify-center transition-all disabled:opacity-75"
          >
            {isLoading ? "Authenticating..." : "Sign In to Operations Console"}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-[#6b6963] flex items-center justify-center gap-1.5 border-t border-[#e7e1d6]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#b48849]" />
          <span>Secured via Signed HTTP-Only Cookie Sessions</span>
        </div>
      </div>
    </div>
  );
}
