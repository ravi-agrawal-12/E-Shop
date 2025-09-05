import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function CategoryGrid({ categories, onSelect }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {categories.map((c) => (
        <motion.button
          key={c.slug}
          variants={item}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(c.slug)}
          className="group relative h-40 rounded-xl overflow-hidden border border-gray-200 text-left"
          aria-label={`Open ${c.title} category`}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03]"
            style={{ backgroundImage: `url('${c.image}')` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold drop-shadow">
                {c.title}
              </h3>
              {typeof c.count === "number" && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                  {c.count}
                </span>
              )}
            </div>
            {c.subtitle && (
              <p className="mt-0.5 text-xs text-white/85 line-clamp-1">
                {c.subtitle}
              </p>
            )}
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
