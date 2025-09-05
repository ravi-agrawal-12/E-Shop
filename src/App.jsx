import React from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import HeroBanner from "./components/HeroBanner";
import ProductCard from "./components/ProductCard";
import products from "./data/products";
import Reveal from "./components/Reveal";
import FiltersBar from "./components/FiltersBar";
import CategoryMarquee from "./components/CategoryMarquee";
import CartDrawer from "./components/CartDrawer";
import DealsSection from "./components/DealsSection";
import QuickViewModal from "./components/QuickViewModal";
import VoiceAgent from "./components/VoiceAgent";

export default function App() {
  // Filters + sorting
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 999999 });
  const [sortBy, setSortBy] = React.useState("relevance");

  // Quick View state
  const [quickView, setQuickView] = React.useState({
    open: false,
    product: null,
  });
  const openQuickView = React.useCallback(
    (p) => setQuickView({ open: true, product: p }),
    []
  );
  const closeQuickView = React.useCallback(
    () => setQuickView({ open: false, product: null }),
    []
  );

  // Cart state
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cart, setCart] = React.useState([]); // {id,title,price,image,qty}

  // Stable cart handlers
  const addToCart = React.useCallback((p) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [
        ...prev,
        { id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 },
      ];
    });
    setCartOpen(true);
  }, []);
  [1];

  const incQty = React.useCallback((id) => {
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );
  }, []);
  [1];

  const decQty = React.useCallback((id) => {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
        .filter(Boolean)
    );
  }, []);
  [1];

  const removeItem = React.useCallback((id) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);
  [1];

  // Categories derived from products
  const categories = React.useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);
  [4];

  // Filter + sort pipeline
  const filtered = React.useMemo(() => {
    return products
      .filter((p) =>
        activeCategory === "all" ? true : p.category === activeCategory
      )
      .filter((p) => {
        const price = Number(String(p.price).replace(/[^0-9.]/g, "")) || 0;
        return price >= priceRange.min && price <= priceRange.max;
      })
      .sort((a, b) => {
        const pa = Number(String(a.price).replace(/[^0-9.]/g, "")) || 0;
        const pb = Number(String(b.price).replace(/[^0-9.]/g, "")) || 0;
        const ra = a.rating ?? 0;
        const rb = b.rating ?? 0;
        if (sortBy === "price-asc") return pa - pb;
        if (sortBy === "price-desc") return pb - pa;
        if (sortBy === "rating-desc") return rb - ra;
        return 0;
      });
  }, [products, activeCategory, priceRange, sortBy]);
  [4];

  // Category marquee data
  const circleCategories = React.useMemo(() => {
    const fromProducts = Array.from(
      new Set(products.map((p) => p.category || "").filter(Boolean))
    )
      .slice(0, 8)
      .map((cat) => {
        const slug = cat.toLowerCase().replace(/\s+/g, "-");
        const prod = products.find(
          (p) => (p.category || "").toLowerCase() === cat.toLowerCase()
        );
        return {
          title: cat,
          slug,
          image:
            prod?.image ||
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
        };
      });
    if (fromProducts.length >= 4) return fromProducts;
    return [
      {
        title: "Makeup",
        slug: "makeup",
        image:
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Shoes",
        slug: "shoes",
        image:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Smartwatches",
        slug: "smartwatches",
        image:
          "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Headphones",
        slug: "headphones",
        image:
          "https://images.unsplash.com/photo-1518444082560-6f6f2f82ed9e?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Bags",
        slug: "bags",
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Apparel",
        slug: "apparel",
        image:
          "https://images.unsplash.com/photo-1520975922323-3d5b1a5f9b45?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Laptops",
        slug: "laptops",
        image:
          "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Cameras",
        slug: "cameras",
        image:
          "https://images.unsplash.com/photo-1519183071298-a2962eadc82e?q=80&w=800&auto=format&fit=crop",
      },
    ];
  }, [products]);
  [4];

  // Category click → filter + scroll with sticky offset
  const onCategoryCircleClick = React.useCallback((slug) => {
    const title = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
    setActiveCategory(title);
    const header = document.querySelector("header");
    const search = document.querySelector("#sticky-searchbar");
    const offset =
      (header?.offsetHeight || 0) + (search?.offsetHeight || 0) + 12;
    const target = document.getElementById("shop");
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);
  [3];

  // Deals setup
  const dealDeadline = React.useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 48);
    return d.toISOString();
  }, []);
  [5];

  const deals = React.useMemo(
    () =>
      products.slice(0, 8).map((p, i) => ({
        ...p,
        off: [30, 25, 20, 15][i % 4],
      })),
    [products]
  );
  [4];

  // Search typing helper
  const voiceSearch = React.useCallback((q) => {
    const el = document.querySelector("input[type='search'], #search-input");
    if (el) {
      el.value = q;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    setActiveCategory("all");
  }, []);

  // Category filter
  const voiceFilterCategory = React.useCallback((value) => {
    const title = value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
    setActiveCategory(title);
    const header = document.querySelector("header");
    const search = document.querySelector("#sticky-searchbar");
    const offset =
      (header?.offsetHeight || 0) + (search?.offsetHeight || 0) + 12;
    const target = document.getElementById("shop");
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const voiceOpenDeals = React.useCallback(() => {
    location.hash = "#deals";
  }, []);

  const addToCartByName = React.useCallback(
    (name) => {
      if (!name) return false;
      const n = name.toLowerCase();
      const prod = products.find((p) =>
        (p.title || "").toLowerCase().includes(n)
      );
      if (!prod) return false;
      addToCart(prod);
      return true;
    },
    [addToCart, products]
  );

  const [agentActive, setAgentActive] = React.useState(false);

  React.useEffect(() => {
    if (!agentActive) return;
    const t = setTimeout(() => setAgentActive(false), 8000);
    return () => clearTimeout(t);
  }, [agentActive]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar onOpenCart={() => setCartOpen(true)} /> */}
      <Navbar onOpenAgent={() => setAgentActive((v) => !v)} />
      <SearchBar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <HeroBanner />

        {/* Home */}
        <section id="home" className="pt-10">
          <Reveal>
            <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-5 py-6">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
                Welcome to E‑Shop
              </h1>
              <p className="mt-1 text-gray-600">
                Find curated picks, voice‑assisted search, and exclusive
                offers—start just below.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Shop with Filters */}
        <section id="shop" className="py-20">
          <Reveal>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {activeCategory === "all"
                ? "Featured Products"
                : `Showing: ${activeCategory}`}
            </h2>
          </Reveal>

          <FiltersBar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resultsCount={filtered.length}
          />

          {filtered.length === 0 ? (
            <Reveal>
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                No products match these filters. Try adjusting price or
                category.
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: Math.min(i * 0.03, 0.3),
                  }}
                >
                  <ProductCard product={product} onQuickView={openQuickView} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Categories */}
        <section id="categories" className="py-20">
          <Reveal>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mb-5 text-sm text-gray-600">
              Tap a category to jump into products.
            </p>
          </Reveal>

          <CategoryMarquee
            items={circleCategories}
            onSelect={onCategoryCircleClick}
            speed={0.08}
            gap={28}
            step={3}
          />
        </section>

        {/* Deals */}
        <DealsSection
          deals={deals}
          deadlineISO={dealDeadline}
          onQuickView={openQuickView}
          onAddToCart={addToCart}
        />

        {/* Quick View Modal */}
        <QuickViewModal
          open={quickView.open}
          product={quickView.product}
          onClose={closeQuickView}
          onAddToCart={addToCart}
        />

        {/* Cart Drawer (portaled component) */}
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cart}
          onInc={incQty}
          onDec={decQty}
          onRemove={removeItem}
        />

        <VoiceAgent
          active={agentActive}
          onInactive={() => setAgentActive(false)}
          onSearch={voiceSearch}
          onFilterCategory={voiceFilterCategory}
          onOpenDeals={voiceOpenDeals}
          onAddToCartByName={addToCartByName}
        />
      </main>
    </div>
  );
}
