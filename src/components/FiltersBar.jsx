import React from "react";
import { motion } from "framer-motion";

const sortOptions = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
  { id: "rating-desc", label: "Rating ★" },
];

export default function FiltersBar({
  categories,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  resultsCount,
}) {
  const [draft, setDraft] = React.useState(priceRange);

  React.useEffect(() => {
    setDraft(priceRange);
  }, [priceRange]);

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Sort segmented control */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-600">Sort</span>
          <div className="inline-flex overflow-hidden rounded-lg ring-1 ring-gray-300">
            {sortOptions.map((s, i) => {
              const active = sortBy === s.id;
              return (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSortBy(s.id)}
                  className={[
                    "px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50",
                    i !== sortOptions.length - 1 ? "border-r border-gray-300/70" : "",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {s.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Price controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Price</span>
          <label className="text-xs text-gray-600">
            Min
            <input
              type="number"
              min={0}
              value={draft.min}
              onChange={(e) =>
                setDraft((r) => ({ ...r, min: Number(e.target.value || 0) }))
              }
              className="ml-1 w-24 rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="text-xs text-gray-600">
            Max
            <input
              type="number"
              min={0}
              value={draft.max}
              onChange={(e) =>
                setDraft((r) => ({ ...r, max: Number(e.target.value || 0) }))
              }
              className="ml-1 w-24 rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            onClick={() => setPriceRange(draft)}
            className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setDraft({ min: 0, max: 999999 });
              setPriceRange({ min: 0, max: 999999 });
            }}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        {/* Count */}
        <div className="text-xs text-gray-600">{resultsCount} items</div>
      </div>

      {/* Category pills */}
      <div className="mt-3 flex flex-wrap gap-2">
        <CategoryPill
          label="All"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {categories.map((c) => (
          <CategoryPill
            key={c}
            label={c}
            active={activeCategory === c}
            onClick={() => setActiveCategory(c)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryPill({ label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition",
        active
          ? "bg-indigo-600 text-white ring-indigo-600"
          : "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50",
      ].join(" ")}
      aria-pressed={active}
    >
      {label}
    </motion.button>
  );
}
