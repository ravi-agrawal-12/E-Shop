import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

function useScrollLock(active) {
  React.useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

function CartDrawer({
  open,
  onClose,
  items,
  onInc,
  onDec,
  onRemove,
}) {
  useScrollLock(open);

  const subtotal = items.reduce((sum, it) => {
    const price = Number(String(it.price).replace(/[^0-9.]/g, "")) || 0;
    return sum + price * it.qty;
  }, 0);

  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("portal-root")
      : null;

  if (!portalRoot) return null;

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-">[2][1]
          {/* Overlay */}
          <motion.button
            aria-label="Close cart"
            onClick={onClose}
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.aside
            className="absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white shadow-2xl ring-1 ring-black/5 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            role="dialog"
            aria-modal="true"
          >
            {/* Header with safe-area top */}
            <div className="flex items-center justify-between px-4 py-3 border-b pt-[max(theme(spacing.3),env(safe-area-inset-top))]">
              <h3 className="font-heading text-lg font-semibold">Your Cart</h3>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.length === 0 ? (
                <div className="text-sm text-gray-600">Cart is empty.</div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="flex gap-3 border rounded-lg p-2">
                    <img
                      src={it.image}
                      alt={it.title}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {it.title}
                        </h4>
                        <button
                          className="text-xs text-gray-500 hover:text-gray-800"
                          onClick={() => onRemove(it.id)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-blue-600 font-semibold">
                          {it.price}
                        </span>
                        <div className="inline-flex items-center gap-2">
                          <button
                            className="h-7 w-7 rounded bg-gray-100 hover:bg-gray-200"
                            onClick={() => onDec(it.id)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-sm w-6 text-center">
                            {it.qty}
                          </span>
                          <button
                            className="h-7 w-7 rounded bg-gray-100 hover:bg-gray-200"
                            onClick={() => onInc(it.id)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with safe-area bottom */}
            <div className="border-t p-4 pb-[max(theme(spacing.4),env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <button className="mt-3 w-full rounded-lg bg-gray-900 text-white py-3 font-semibold hover:bg-black">
                Checkout
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, portalRoot);
}

export default React.memo(CartDrawer);
