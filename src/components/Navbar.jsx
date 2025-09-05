import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "shop", "categories", "deals"];
      let current = "home";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) current = id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onHashClick = (e, id) => {
    e.preventDefault();
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMenuOpen(false);
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    const header = document.querySelector("header");
    const search = document.querySelector("#sticky-searchbar");
    const offset =
      (header?.offsetHeight || 0) + (search?.offsetHeight || 0) + 12; // slightly more padding
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
  };

  const links = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop" },
    { id: "categories", label: "Categories" },
    { id: "deals", label: "Deals" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14">
        <div className="flex items-center gap-4">
          <button
            className="block md:hidden text-2xl text-gray-800"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
          <div className="text-xl font-extrabold tracking-wide text-gray-900">
            E‑Shop
          </div>
        </div>

        <div className="hidden md:flex gap-6 font-medium text-gray-700 text-sm">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => onHashClick(e, l.id)}
              className={`pb-1 ${
                activeSection === l.id
                  ? "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            aria-label="Account"
          >
            👤
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            aria-label="Cart"
          >
            🛒
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white text-gray-800 px-6 py-4 space-y-3 border-t"
            role="menu"
          >
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => onHashClick(e, l.id)}
                className={`block pb-1 ${
                  activeSection === l.id
                    ? "text-blue-600 font-bold border-b-2 border-blue-600 inline-block"
                    : "hover:text-blue-600"
                }`}
                role="menuitem"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
