// src/components/DealsSection.jsx
import React from "react";
import { motion } from "framer-motion";
import useCountdown from "../hooks/useCountdown";

function NumberPill({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-12 rounded-lg bg-white/90 px-2 py-1.5 text-center text-gray-900 font-semibold">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[11px] text-white/85">{label}</span>
    </div>
  );
}

function discountPrice(priceStr, offPercent = 20) {
  const price = Number(String(priceStr).replace(/[^0-9.]/g, "")) || 0;
  const discounted = price * (1 - offPercent / 100);
  return { price, discounted: `$${discounted.toFixed(2)}` };
}

export default function DealsSection({
  deals = [],
  deadlineISO,
  onQuickView,
  onAddToCart,
}) {
  const { days, hours, minutes, seconds, done } = useCountdown(deadlineISO);

  return (
    <section id="deals" className="py-20">
      {/* Flash banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-fuchsia-600 to-indigo-600"
      >
        <div className="absolute inset-0 bg-[radial-gradient(80%_100%_at_0%_0%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative z-10 grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:items-center">
          <div className="text-white">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              Limited‑time Flash Deals
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold leading-tight">
              Save big before time runs out
            </h2>
            <p className="mt-1 text-white/90">
              Extra discounts on popular picks. New offers drop daily.
            </p>

            {/* Countdown */}
            <div className="mt-4 flex items-center gap-3">
              {done ? (
                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-900">
                  Offer ended — new deals soon
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <NumberPill label="Days" value={days} />
                  <span className="text-white/80">:</span>
                  <NumberPill label="Hrs" value={hours} />
                  <span className="text-white/80">:</span>
                  <NumberPill label="Min" value={minutes} />
                  <span className="text-white/80">:</span>
                  <NumberPill label="Sec" value={seconds} />
                </div>
              )}
            </div>

            <a
              href="#shop"
              className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:shadow-md"
            >
              Shop all deals →
            </a>
          </div>

          {/* Banner image */}
          <motion.img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop"
            alt="Deal banner"
            className="w-full rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </motion.div>

      {/* Deal rail */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-gray-900">
            Today’s Top Deals
          </h3>
          <span className="text-xs text-gray-500">Auto‑updated hourly</span>
        </div>

        <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
          <div className="flex gap-4">
            {deals.map((p, i) => {
              const { price, discounted } = discountPrice(p.price, p.off ?? 20);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}
                  className="w-64 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <button
                    onClick={() => onQuickView?.(p)}
                    className="relative block h-40 w-full"
                    aria-label={`Quick view ${p.title}`}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Discount badge */}
                    <span className="absolute left-2 top-2 rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                      {p.off ?? 20}% OFF
                    </span>
                  </button>

                  <div className="p-3">
                    <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
                      {p.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-blue-600 text-sm font-semibold">{discounted}</span>
                      <span className="text-xs text-gray-400 line-through">${price.toFixed(2)}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black"
                        onClick={() => onAddToCart?.(p)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-gray-300 hover:bg-gray-50"
                        onClick={() => onQuickView?.(p)}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
