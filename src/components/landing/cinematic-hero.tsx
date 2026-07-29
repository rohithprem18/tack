"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const FADE_SECONDS = 0.5;

const NAV_LINKS = [{ label: "Home", href: "/", active: true }];

/**
 * Fullscreen video hero with a hand-rolled fade-in/fade-out loop.
 *
 * The <video> element's native `loop` attribute cuts hard from the last
 * frame back to the first, which reads as a jump. Instead we drive opacity
 * off `currentTime` every animation frame (fade in over the first 0.5s,
 * fade out over the last 0.5s) and manually restart playback on `ended`,
 * so the seam is invisible.
 */
export function CinematicHero({
  isLoggedIn = false,
  onSignOut,
}: {
  isLoggedIn?: boolean;
  onSignOut?: () => Promise<void>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let restartTimeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const { currentTime, duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        let opacity = 1;
        if (currentTime < FADE_SECONDS) {
          opacity = currentTime / FADE_SECONDS;
        } else if (duration - currentTime < FADE_SECONDS) {
          opacity = (duration - currentTime) / FADE_SECONDS;
        }
        video.style.opacity = String(Math.min(1, Math.max(0, opacity)));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const handleEnded = () => {
      video.style.opacity = "0";
      restartTimeout = setTimeout(() => {
        video.currentTime = 0;
        void video.play();
      }, 100);
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(restartTimeout);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background video layer */}
      <video
        ref={videoRef}
        className="absolute z-0 w-full object-cover"
        style={{ top: "300px", inset: "auto 0 0 0", opacity: 0 }}
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="font-serif text-3xl tracking-tight text-[#000000]"
        >
          Tack
          <sup className="text-base">®</sup>
        </Link>
        <div className="flex items-center gap-8 font-inter">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                link.active ? "text-[#000000]" : "text-[#6F6F6F] hover:text-[#000000]"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            onSignOut && (
              <form action={onSignOut}>
                <button
                  type="submit"
                  className="text-sm text-[#6F6F6F] transition-colors hover:text-[#000000]"
                >
                  Log out
                </button>
              </form>
            )
          ) : (
            <Link
              href="/login"
              className="text-sm text-[#6F6F6F] transition-colors hover:text-[#000000]"
            >
              Log in
            </Link>
          )}
          <Link
            href={isLoggedIn ? "/boards" : "/register"}
            className="rounded-full bg-[#000000] px-6 py-2.5 text-sm text-[#FFFFFF] transition-transform hover:scale-[1.03]"
          >
            {isLoggedIn ? "Your boards" : "Begin Journey"}
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <section
        className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
        style={{ paddingTop: "calc(8rem - 75px)" }}
      >
        <h1
          className="animate-fade-rise max-w-7xl font-serif text-5xl font-normal text-[#000000] sm:text-7xl md:text-8xl"
          style={{ lineHeight: 0.95, letterSpacing: "-2.46px" }}
        >
          Beyond <em className="italic text-[#6F6F6F]">the noise,</em> we pin{" "}
          <em className="italic text-[#6F6F6F]">the work down.</em>
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl font-inter text-base leading-relaxed text-[#6F6F6F] sm:text-lg">
          A minimal board for lists and cards, built for focused teams. Through
          the noise, we craft a calm space for deep work and clear flow.
        </p>

        <Link
          href={isLoggedIn ? "/boards" : "/register"}
          className="animate-fade-rise-delay-2 mt-12 rounded-full bg-[#000000] px-14 py-5 text-base text-[#FFFFFF] transition-transform hover:scale-[1.03]"
        >
          {isLoggedIn ? "Go to your boards" : "Begin Journey"}
        </Link>
      </section>
    </div>
  );
}
