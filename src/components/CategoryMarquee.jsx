// src/components/CategoryMarquee.jsx
import React from "react";
import { motion, useAnimationFrame } from "framer-motion";

function CategoryTile({ title, image, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex flex-col items-center gap-2 outline-none"
      aria-label={`Open ${title} category`}
    >
      <span
        className="relative inline-flex h-24 w-36 sm:h-28 sm:w-44 items-center justify-center rounded-xl ring-1 ring-gray-300 bg-white overflow-hidden shadow-sm transition group-hover:shadow-md"
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>
      <span className="text-xs sm:text-[13px] font-medium text-gray-700 group-hover:text-gray-900">
        {title}
      </span>
    </button>
  );
}

/**
 * Infinite marquee (RTL) with manual controls.
 * - Auto-scrolls continuously.
 * - Pauses on hover/focus and while interacting with controls.
 * - Left/Right controls shift by `step` tiles.
 */
export default function CategoryMarquee({
  items,
  onSelect,
  speed = 0.06, // px per ms
  gap = 28,     // px spacing between tiles
  step = 3,     // tiles per click
}) {
  const [offset, setOffset] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Estimated tile width (matches h-24 w-36 + horizontal padding), keep consistent with layout
  const tileWidth = 180; // adjust if you tweak sizes
  const baseWidth = items.length * (tileWidth + gap); // one loop width [1]

  // Duplicate items to make the loop seamless on any screen width [1][2]
  const doubled = React.useMemo(() => [...items, ...items], [items]);

  // Auto-scroll each frame unless paused [1]
  useAnimationFrame((_, delta) => {
    if (paused) return;
    setOffset((prev) => {
      const next = prev - delta * speed; // scroll left (RTL) [3]
      return next <= -baseWidth ? next + baseWidth : next; // wrap seamlessly [1]
    });
  });

  const shiftBy = (tiles) => {
    // Negative because we’re moving left; positive tiles moves visually right
    const deltaPx = -tiles * (tileWidth + gap);
    setOffset((prev) => {
      let next = prev + deltaPx;
      // Normalize within [-baseWidth, 0)
      while (next <= -baseWidth) next += baseWidth;
      while (next > 0) next -= baseWidth;
      return next;
    });
  };

  const handlePrev = () => {
    setPaused(true);
    shiftBy(-step); // move left visually (previous items)
  };

  const handleNext = () => {
    setPaused(true);
    shiftBy(step); // move right visually (next items)
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Track */}
      <motion.div
        style={{ x: offset }}
        className="flex items-center"
        aria-hidden="false"
      >
        {doubled.map((c, idx) => (
          <div
            key={`${c.slug}-${idx}`}
            className="px-3 sm:px-4"
            style={{ minWidth: tileWidth }}
          >
            <CategoryTile
              title={c.title}
              image={c.image}
              onClick={() => onSelect(c.slug)}
            />
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
        <div className="pointer-events-auto pl-1">
          <button
            type="button"
            aria-label="Previous"
            onClick={handlePrev}
            onBlur={() => setPaused(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 ring-1 ring-gray-300 shadow hover:bg-white"
          >
            ◀
          </button>
        </div>
        <div className="pointer-events-auto pr-1">
          <button
            type="button"
            aria-label="Next"
            onClick={handleNext}
            onBlur={() => setPaused(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 ring-1 ring-gray-300 shadow hover:bg-white"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
