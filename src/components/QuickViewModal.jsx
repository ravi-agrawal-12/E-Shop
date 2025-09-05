import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function useScrollLock(active) {
  React.useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

function QuickViewModal({ open, onClose, product, onAddToCart }) {
  useScrollLock(open);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const firstRef = React.useRef(null);
  React.useEffect(() => {
    if (open) setTimeout(() => firstRef.current?.focus(), 0);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-">
          <motion.button
            aria-label="Close modal"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="absolute inset-x-0 top-10 mx-auto w-[min(96%,900px)] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative h-64 md:h-full bg-gray-50">
                <img
                  src={product?.image}
                  alt={product?.title || "Product"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-lg sm:text-xl font-semibold text-gray-900">
                    {product?.title || "Product"}
                  </h3>
                  <button
                    ref={firstRef}
                    className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center"
                    onClick={onClose}
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-1 flex items-center gap-3">
                  <span className="text-blue-600 text-lg font-semibold">
                    {product?.price || "$0.00"}
                  </span>
                  {typeof product?.rating === "number" && (
                    <span className="text-xs rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5">
                      ★ {product.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-4">
                  {product?.description || "Product description will appear here."}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <label className="text-xs text-gray-600">
                    Qty
                    <input
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="ml-2 w-16 rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <button
                    className="rounded-lg bg-gray-900 text-white text-sm font-semibold px-4 py-2 hover:bg-black"
                    onClick={() => onAddToCart?.(product)}
                  >
                    Add to Cart
                  </button>
                  <a
                    href="#shop"
                    className="rounded-lg bg-white ring-1 ring-gray-300 text-sm font-semibold px-4 py-2 hover:bg-gray-50"
                  >
                    View Details
                  </a>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="text-gray-500">Delivery</div>
                    <div className="font-medium text-gray-800">2–5 days</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="text-gray-500">Returns</div>
                    <div className="font-medium text-gray-800">30‑day easy return</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(QuickViewModal);
