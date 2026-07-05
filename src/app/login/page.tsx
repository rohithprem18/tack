import Link from "next/link";
import { Logo } from "@/components/logo";
import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/lib/actions/auth";
import { googleSignInAction } from "@/lib/actions/oauth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[360px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-1 text-center text-[20px] font-medium">Log in</h1>
        <p className="mb-6 text-center text-sm text-muted">
          Welcome back to your boards.
        </p>
        <AuthForm mode="login" action={loginAction} googleAction={googleSignInAction} />
        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/register" className="text-ink underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
