import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function HeroBanner() {
  const textRef = useRef(null);

  // Choose a high-quality hero image (replace easily here)
  const HERO_IMAGE =
    "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2000&auto=format&fit=crop";[1]

  useEffect(() => {
    if (!textRef.current) return;
    gsap.from(textRef.current, {
      y: 50,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
    });
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden rounded-xl text-white">
      {/* Background image (base layer) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Color overlays (non-blocking) */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-indigo-600/85 via-blue-600/75 to-purple-600/65" /> {/* [2][1] */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/10" /> {/* subtle contrast [2] */}

      {/* Foreground content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div ref={textRef} className="space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              Voice + Multi‑Language • 24/7
            </span>

            <h1 className="font-heading text-3xl md:text-5xl font-extrabold leading-tight">
              Shop hands‑free with <span className="text-yellow-300">AI Agent</span>
            </h1>

            <p className="text-base md:text-lg text-gray-100/90 max-w-prose">
              Find products faster, get instant answers, and checkout securely—just ask.
            </p>

            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-100/95">
              <li className="flex items-center gap-2"><span>⚡</span> Instant search</li>
              <li className="flex items-center gap-2"><span>🎯</span> Smart recommendations</li>
              <li className="flex items-center gap-2"><span>🔒</span> Secure checkout</li>
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {}}
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-sm font-semibold text-black shadow-[0_8px_20px_rgba(234,179,8,0.35)] ring-1 ring-yellow-300/50 hover:bg-yellow-500 transition"
              >
                🤖 Ask the AI
              </motion.button>

              <motion.a
                href="#shop"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20 transition"
              >
                🛍️ Start Shopping
              </motion.a>
            </div>
          </div>

          {/* Spacer to reveal more of the background on large screens */}
          <div className="hidden md:block" />
        </div>
      </div>
    </section>
  );
}
