"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("잘못된 비밀번호입니다");
        return;
      }

      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F8F5F0" }}
    >
      <div className="w-full max-w-sm px-8">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex flex-col leading-none">
            <span
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{ color: "#6B6560" }}
            >
              Design
            </span>
            <span
              className="text-base tracking-[0.2em] uppercase"
              style={{
                color: "#1A1814",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              NADEUL
            </span>
            </Link>
          </div>

        <h1
          className="text-xl font-light text-center mb-8"
          style={{ color: "#1A1814", fontFamily: "'DM Sans', sans-serif" }}
        >
          관리자 로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoFocus
            className="w-full bg-transparent border-b text-sm outline-none transition-colors duration-300 pb-2.5"
            style={{
              borderColor: error ? "#C0392B" : "#E5DDD4",
              color: "#1A1814",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />

          {error && (
            <p
              className="text-xs text-center"
              style={{ color: "#C0392B" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-3 rounded-full text-xs tracking-[0.2em] uppercase text-white transition-all duration-300 hover:opacity-80 disabled:opacity-40"
            style={{ backgroundColor: "#1A1814" }}
          >
            {loading ? (
              <span
                className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            ) : (
              "로그인"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
