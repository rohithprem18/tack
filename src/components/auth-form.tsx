"use client";

import { useActionState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import type { AuthActionState } from "@/lib/actions/auth";

export function AuthForm({
  mode,
  action,
  googleAction,
}: {
  mode: "login" | "register";
  action: (
    state: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
  googleAction: () => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="flex flex-col gap-5">
      <form action={googleAction}>
        <Button variant="ghost" className="w-full" type="submit">
          Continue with Google
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-rule" />
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          Or
        </span>
        <div className="h-px flex-1 bg-rule" />
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        {mode === "register" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm text-muted">
              Name
            </label>
            <Input id="name" name="name" type="text" autoComplete="name" required />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-muted">
            Email
          </label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm text-muted">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            required
          />
        </div>

        {state?.error && (
          <p className="rounded-md border border-rule bg-tint px-3 py-2 text-sm text-ink" role="alert">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-1">
          {pending
            ? "Please wait…"
            : mode === "register"
              ? "Create account"
              : "Log in"}
        </Button>
      </form>
    </div>
  );
}
