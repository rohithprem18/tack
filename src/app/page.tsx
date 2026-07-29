import { auth, signOut } from "@/auth";
import { CinematicHero } from "@/components/landing/cinematic-hero";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return <CinematicHero isLoggedIn={isLoggedIn} onSignOut={signOutAction} />;
}
