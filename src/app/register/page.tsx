import Link from "next/link";
import { Logo } from "@/components/logo";
import { AuthForm } from "@/components/auth-form";
import { registerAction } from "@/lib/actions/auth";
import { googleSignInAction } from "@/lib/actions/oauth";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[360px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-1 text-center text-[20px] font-medium">Create account</h1>
        <p className="mb-6 text-center text-sm text-muted">
          A minimal team board. Free to start.
        </p>
        <AuthForm mode="register" action={registerAction} googleAction={googleSignInAction} />
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
