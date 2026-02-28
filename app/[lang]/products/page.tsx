"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { t, type Lang } from "../lib/i18n";
import type { CategoryKey, Region } from "../lib/catalog/categories";
import { categoriesByRegion } from "../lib/catalog/categories";
import type { Product } from "../lib/catalog/products";
import { MOCK_PRODUCTS } from "../lib/catalog/products";

import { useCart } from "@/app/providers/CartProvider";

type Props = {
  params: Promise<{ lang: string }>;
};

const PAGE_BG = "bg-[#F0FFFF]";
const STORAGE_KEY = "MHANAC_REGION";

/* =========================================================
   ✅ QUICK EDIT ZONE
========================================================= */
const TILE_GREEN = "bg-bleu";
const TILE_WHITE = "bg-white";

/* =========================================================
   ✅ SIZE / POSITION QUICK EDIT
========================================================= */
const WHOLESALE_CARD_W = "w-[260px]";
const WHOLESALE_IMG_H = "h-[130px]";
const CAT_TILE_IMG_H = "h-[92px]";
const WHOLESALE_SCROLL_DX = 520;

const SEASON_TILE_IMG_H = "h-[150px] sm:h-[170px] md:h-[190px]";
const SEASON_GRID_COLS = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
const SEASON_SECTION_GAP = "gap-4";



const ADS_AUTOPLAY_MS = 3500;

/* =========================
   HELPERS
========================= */
function isRegion(x: any): x is Region {
  return x === "us" || x === "haiti";
}

function langForRegion(region: Region): Lang {
  return region === "us" ? "en" : "ht";
}

function formatMoney(p: Product) {
  const n = p.price.toLocaleString();
  return p.currency === "USD" ? `$${n}` : `${n} HTG`;
}

function getCategoryLabel(key: CategoryKey, lang: Lang) {
  return t[lang]?.categories?.[key] ?? t.en.categories[key] ?? key;
}

function scrollRow(ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") {
  const el = ref.current;
  if (!el) return;
  el.scrollBy({
    left: dir === "left" ? -WHOLESALE_SCROLL_DX : WHOLESALE_SCROLL_DX,
    behavior: "smooth",
  });
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

/* =========================================================
   ✅ Auto marquee row
========================================================= */


/* =========================================================
   ✅ Ads Carousel
========================================================= */
function AdsCarousel({
  slides,
  autoplayMs = ADS_AUTOPLAY_MS,
}: {
  slides: { id: string; image: string; title?: string }[];
  autoplayMs?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => setIdx((p) => (p + 1) % slides.length), autoplayMs);
    return () => clearInterval(timer);
  }, [slides.length, autoplayMs]);

  const go = (next: number) => {
    const n = slides.length;
    setIdx((next + n) % n);
  };

  return (
    <div className="rounded-2xl">
      <div className="p-4 flex items-center justify-between">
        <div className="text-sm font-black text-slate-900">Publicité</div>
        <div className="text-xs text-slate-600"></div>
      </div>

      <div className="relative h-[220px] sm:h-[260px] md:h-[300px] bg-slate-50">
        <Image src={slides[idx]?.image} alt={slides[idx]?.title ?? "ad"} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

        <button
          type="button"
          onClick={() => go(idx - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/90 text-white grid place-items-center shadow hover:scale-105 transition"
          aria-label="Prev"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(idx + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/90 text-white grid place-items-center shadow hover:scale-105 transition"
          aria-label="Next"
        >
          ›
        </button>

        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              className={[
                "w-2.5 h-2.5 rounded-full transition",
                i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80",
              ].join(" ")}
              aria-label={`Go slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ✅ Cart Drawer
========================================================= */


/* =========================================================
   ✅ PAGE
========================================================= */
export default function ProductsPage({ params }: Props) {
  const resolvedParams = use(params);
  const lang = (resolvedParams.lang as Lang) || "en";

  const router = useRouter();
  const sp = useSearchParams();

  const { add, count, open: cartOpen, setOpen: setCartOpen, items, subtotal, remove, setQty, clear } = useCart();

  const [region, setRegion] = useState<Region>("us");
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("deals");

  const dealsRowRef = useRef<HTMLDivElement>(null);
  const wholesaleRowRef = useRef<HTMLDivElement>(null);

  // ✅ Filters + Sort + Pagination
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(999999);
  const [conditions, setConditions] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState<number>(0);

  const [sortBy, setSortBy] = useState<"best" | "price_asc" | "price_desc" | "new">("best");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 18;

  // ✅ Init region/lang sync
  useEffect(() => {
    const fromQuery = sp.get("region") as Region | null;
    const fromLS = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Region | null) : null;
    const defaultRegion: Region = lang === "en" ? "us" : "haiti";

    const r: Region = (isRegion(fromQuery) && fromQuery) || (isRegion(fromLS) && fromLS) || defaultRegion;

    setRegion(r);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, r);

    const cat = (sp.get("category") as CategoryKey | null) ?? "deals";
    setActiveCategory(cat);

    const forcedLang = langForRegion(r);
    if (forcedLang !== lang) {
      const p = new URLSearchParams(sp.toString());
      p.set("region", r);
      p.set("category", cat);
      router.replace(`/${forcedLang}/products?${p.toString()}`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => categoriesByRegion(region), [region]);

  const baseProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.region === region && p.category === activeCategory);
  }, [region, activeCategory]);

  const availableBrands = useMemo(
    () => uniq(baseProducts.map((p: any) => p.brand).filter(Boolean) as string[]),
    [baseProducts]
  );
  const availableColors = useMemo(
    () => uniq(baseProducts.map((p: any) => p.color).filter(Boolean) as string[]),
    [baseProducts]
  );
  const availableConditions = useMemo(
    () => uniq(baseProducts.map((p: any) => p.condition).filter(Boolean) as string[]),
    [baseProducts]
  );

  useEffect(() => {
    if (!baseProducts.length) {
      setPriceMin(0);
      setPriceMax(999999);
      setConditions(new Set());
      setColors(new Set());
      setBrands(new Set());
      setMinRating(0);
      setSortBy("best");
      setPage(1);
      return;
    }
    const prices = baseProducts.map((p) => p.price);
    setPriceMin(Math.min(...prices));
    setPriceMax(Math.max(...prices));
    setConditions(new Set());
    setColors(new Set());
    setBrands(new Set());
    setMinRating(0);
    setSortBy("best");
    setPage(1);
  }, [region, activeCategory, baseProducts]);

  const filteredProducts = useMemo(() => {
    let list = baseProducts;

    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter((p) => (p.title[lang] ?? p.title.en).toLowerCase().includes(qq));
    }

    list = list.filter((p) => p.price >= priceMin && p.price <= priceMax);

    if (conditions.size) list = list.filter((p: any) => p.condition && conditions.has(p.condition));
    if (colors.size) list = list.filter((p: any) => p.color && colors.has(p.color));
    if (brands.size) list = list.filter((p: any) => p.brand && brands.has(p.brand));

    if (minRating > 0) list = list.filter((p: any) => (p.rating ?? 0) >= minRating);

    const sorted = [...list];
    if (sortBy === "price_asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "new") sorted.sort((a: any, b: any) => Number(!!b.isNew) - Number(!!a.isNew));

    return sorted;
  }, [baseProducts, q, lang, priceMin, priceMax, conditions, colors, brands, minRating, sortBy]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE)), [filteredProducts.length]);

  const pagedProducts = useMemo(() => {
    const safePage = clamp(page, 1, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page, totalPages]);

  useEffect(() => {
    setPage((p) => clamp(p, 1, totalPages));
  }, [totalPages]);

  const deals = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.region === region && p.category === "deals");
  }, [region]);

  function goCategory(key: CategoryKey) {
    setActiveCategory(key);
    setPage(1);

    const p = new URLSearchParams(sp.toString());
    p.set("region", region);
    p.set("category", key);
    router.replace(`/${lang}/products?${p.toString()}`);
  }

  const i = t[lang]?.productsPage ?? t.en.productsPage;

  const promoSlides = [
    { id: "promo1", title: i.promos.p1_title, subtitle: i.promos.p1_sub, image: "/images/front.png" },
    { id: "promo2", title: i.promos.p2_title, subtitle: i.promos.p2_sub, image: "/images/front.png" },
  ];

  const diasporaCards = [
    { id: "d1", title: i.diaspora.d1_title, subtitle: i.diaspora.d1_sub, image: "/images/listproduc/groce1.png" },
    { id: "d2", title: i.diaspora.d2_title, subtitle: i.diaspora.d2_sub, image: "/images/listproduc/home.png" },
    { id: "d3", title: i.diaspora.d3_title, subtitle: i.diaspora.d3_sub, image: "/images/listproduc/electro.png" },
  ];

  const categoryTiles = [
    { key: "grocery" as CategoryKey, title: "Grocery", img: "/images/listproduc/grocery.png" },
    { key: "home_kitchen" as CategoryKey, title: "Home", img: "/images/listproduc/home.png" },
    { key: "beauty" as CategoryKey, title: "Beauty", img: "/images/listproduc/beauty.png" },
    { key: "electronics" as CategoryKey, title: "Electronics", img: "/images/listproduc/electro.png" },
    { key: "fashion" as CategoryKey, title: "Fashion", img: "/images/listproduc/fashion.png" },
    { key: "sports_outdoors" as CategoryKey, title: "Sports", img: "/images/listproduc/sport.png" },
  ];

  const wholesaleCards = [
    { id: "w1", title: "Wholesale", sub: "Bulk price • Fast delivery", img: "/images/listproduc/groce1.png" },
    { id: "w2", title: "Wholesale", sub: "C-Store • Grocery • Home", img: "/images/listproduc/grocery.png" },
    { id: "w3", title: "Wholesale", sub: "Electronics • Beauty • Fashion", img: "/images/listproduc/electro.png" },
  ];

  const seasons = [
    { id: "s1", title: "Valentin", img: "/images/saison/valentin.jpg" },
    { id: "s2", title: "Summer", img: "/images/saison/summer.jpg" },
    { id: "s3", title: "Winter", img: "/images/saison/carnaval.jpg" },
    { id: "s4", title: "Halloween", img: "/images/saison/halloween.jpg" },
    { id: "s5", title: "Fall", img: "/images/saison/fall.jpg" },
    { id: "s6", title: "Spring", img: "/images/saison/sprin.png" },
  ];

  const adsSlides = [
    { id: "ad1", image: "/images/front.png", title: "Ad 1" },
    { id: "ad2", image: "/images/front.png", title: "Ad 2" },
    { id: "ad3", image: "/images/front.png", title: "Ad 3" },
  ];

  const listA = useMemo(() => MOCK_PRODUCTS.filter((p) => p.region === region).slice(0, 10), [region]);
  const listB = useMemo(() => MOCK_PRODUCTS.filter((p) => p.region === region).slice(6, 16), [region]);

  return (
    <div className={`${PAGE_BG} min-h-screen w-full`}>
      <main className="w-full px-3 sm:px-4 py-5">

{/* Products + Filters */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              
              <div className="text-xs text-slate-600">
                Region: <b>{region.toUpperCase()}</b> • Category: <b>{activeCategory}</b> •{" "}
                <b>{filteredProducts.length}</b> results
              </div>
            </div>
          </div>

          {/* Top bar */}
          <div className="mt-4 rounded-2xl bg-white border border-black/10 shadow-sm p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-slate-700 mb-1">Search</div>
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black-800 color:black"
                />
              </div>

              <div className="w-full lg:w-[220px]">
                <div className="text-[11px] font-bold text-slate-700 mb-1">Sort</div>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black-800"
                >
                  <option value="best">Best</option>
                  <option value="new">New</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                </select>
              </div>

             
            </div>

            <div className="mt-3 text-xs text-slate-600">
              Page <b className="text-slate-900">{page}</b> / <b className="text-slate-900">{totalPages}</b>
            </div>
          </div>

          {/* Two columns: filters + products */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* LEFT FILTERS */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-4 sticky top-4">
                <div className="text-sm font-black text-slate-900">Filters</div>

                {/* Price */}
                <div className="mt-4">
                  <div className="text-xs font-bold text-slate-700">Price</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => {
                        setPriceMin(Number(e.target.value || 0));
                        setPage(1);
                      }}
                      className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black-800"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => {
                        setPriceMax(Number(e.target.value || 0));
                        setPage(1);
                      }}
                      className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black-800"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="mt-4">
                  <div className="text-xs font-bold text-slate-700">Condition</div>
                  <div className="mt-2 space-y-2">
                    {availableConditions.length ? (
                      availableConditions.map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={conditions.has(c)}
                            onChange={() => {
                              setConditions((prev) => {
                                const next = new Set(prev);
                                next.has(c) ? next.delete(c) : next.add(c);
                                return next;
                              });
                              setPage(1);
                            }}
                          />
                          <span className="capitalize">{c}</span>
                        </label>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No condition data</div>
                    )}
                  </div>
                </div>

                {/* Color */}
                <div className="mt-4">
                  <div className="text-xs font-bold text-slate-700">Color</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableColors.length ? (
                      availableColors.map((c) => {
                        const active = colors.has(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setColors((prev) => {
                                const next = new Set(prev);
                                next.has(c) ? next.delete(c) : next.add(c);
                                return next;
                              });
                              setPage(1);
                            }}
                            className={[
                              "px-3 py-1 rounded-full border text-xs font-semibold transition",
                              active ? "bg-[#E1EDDD] border-green-400" : "bg-white border-black/10 hover:border-bleu-800",
                            ].join(" ")}
                          >
                            {c}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-xs text-slate-500">No color data</div>
                    )}
                  </div>
                </div>

                {/* Brand */}
                <div className="mt-4">
                  <div className="text-xs font-bold text-slate-700">Brand</div>
                  <div className="mt-2 space-y-2 max-h-40 overflow-auto pr-1">
                    {availableBrands.length ? (
                      availableBrands.map((b) => (
                        <label key={b} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={brands.has(b)}
                            onChange={() => {
                              setBrands((prev) => {
                                const next = new Set(prev);
                                next.has(b) ? next.delete(b) : next.add(b);
                                return next;
                              });
                              setPage(1);
                            }}
                          />
                          <span>{b}</span>
                        </label>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No brand data</div>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-4">
                  <div className="text-xs font-bold text-slate-700">Min Rating</div>
                  <select
                    value={minRating}
                    onChange={(e) => {
                      setMinRating(Number(e.target.value));
                      setPage(1);
                    }}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black-800"
                  >
                    <option value={0}>All</option>
                    <option value={3}>3+ stars</option>
                    <option value={4}>4+ stars</option>
                    <option value={4.5}>4.5+ stars</option>
                  </select>
                </div>

                {/* Reset */}
                <button
                  type="button"
                  onClick={() => {
                    const prices = baseProducts.map((p) => p.price);
                    setPriceMin(prices.length ? Math.min(...prices) : 0);
                    setPriceMax(prices.length ? Math.max(...prices) : 999999);
                    setConditions(new Set());
                    setColors(new Set());
                    setBrands(new Set());
                    setMinRating(0);
                    setSortBy("best");
                    setQ("");
                    setPage(1);
                  }}
                  className="mt-5 w-full rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:ring-2 hover:ring-black-800"
                >
                  Reset filters
                </button>
              </div>
            </div>

            {/* RIGHT PRODUCTS */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`${activeCategory}-${page}-${filteredProducts.length}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                  {pagedProducts.map((p: any) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden"
                    >
                      <div className="relative h-[150px] bg-slate-50">
                        <Image src={p.image ?? "/images/front.png"} alt={p.title.en} fill className="object-contain p-4" />
                        {p.isNew && (
                          <div className="absolute left-2 top-2 text-[10px] font-black bg-black-600 text-white px-2 py-1 rounded-full">
                            NEW
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                          {p.title[lang] ?? p.title.en}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm font-black text-slate-900">{formatMoney(p)}</div>
                          <div className="text-[11px] text-slate-600">⭐ {(p.rating ?? 0).toFixed(1)}</div>
                        </div>

                        <div className="mt-1 text-[11px] text-slate-500">
                          {p.brand ? <span>{p.brand}</span> : null}
                          {p.condition ? <span className="ml-2 capitalize">• {p.condition}</span> : null}
                          {p.color ? <span className="ml-2">• {p.color}</span> : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => add(p, 1)}
                          className="mt-3 w-full bg-[#0b4fb3] text-white text-xs font-semibold py-2 rounded-full hover:opacity-95 active:scale-[0.98] transition"
                        >
                          Add to cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}
                  className="px-3 py-2 rounded-xl border border-black/10 bg-white text-sm font-semibold hover:ring-2 hover:ring-black-300 disabled:opacity-40"
                  disabled={page <= 1}
                >
                  Prev
                </button>

                {Array.from({ length: Math.min(7, totalPages) }).map((_, idx) => {
                  const start = clamp(page - 3, 1, Math.max(1, totalPages - 6));
                  const pnum = start + idx;
                  if (pnum > totalPages) return null;
                  const active = pnum === page;

                  return (
                    <button
                      key={pnum}
                      type="button"
                      onClick={() => setPage(pnum)}
                      className={[
                        "w-10 h-10 rounded-xl border text-sm font-bold transition",
                        active ? "bg-[#E1EDDD] border-bleu-400" : "bg-white border-black/10 hover:border-black-300",
                      ].join(" ")}
                    >
                      {pnum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}
                  className="px-3 py-2 rounded-xl border border-black/10 bg-white text-sm font-semibold hover:ring-2 hover:ring-black-300 disabled:opacity-100"
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>

        

        {/* promos + diaspora */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {promoSlides.map((s) => (
              <div
                key={s.id}
                className="relative overflow-hidden rounded-2xl bg-white border border-black/10 shadow-sm min-h-[190px]"
              >
                <div className="absolute inset-0">
                  <Image src={s.image} alt={s.title} fill className="object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40" />
                </div>
                <div className="relative p-5">
                  <div className="text-sm font-bold text-slate-900">{s.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{s.subtitle}</div>
                  <button
                    type="button"
                    onClick={() => goCategory("deals")}
                    className="mt-4 inline-flex items-center gap-2 bg-[#0b4fb3] text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-95"
                  >
                    Shop <span>›</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 gap-4">
            {diasporaCards.map((d) => (
              <div key={d.id} className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="text-xs font-bold text-slate-900">{d.title}</div>
                  <div className="text-[11px] text-slate-600">{d.subtitle}</div>
                </div>
                <div className="relative h-[150px] bg-gradient-to-b from-white to-slate-50">
                  <Image src={d.image} alt={d.title} fill className="object-contain p-4" />
                </div>
                <div className="p-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => goCategory("deals")}
                    className="bg-[#0b4fb3] text-white text-xs font-semibold px-4 py-2 rounded-full"
                  >
                    Shop
                  </button>
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="border border-black/10 text-slate-900 text-xs font-semibold px-4 py-2 rounded-full hover:ring-2 hover:ring-white-300"
                  >
                    Cart ({count})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ads carousel */}
        <section className="mt-8">
          <AdsCarousel slides={adsSlides} />
        </section>

        {/* Wholesale + categories tiles */}
        <section className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 rounded-2xl border border-black/10 shadow-sm overflow-hidden bg-white">
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-slate-900">Wholesale</div>
                  <div className="text-xs text-slate-600">Horizontal diaporama</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollRow(wholesaleRowRef, "left")}
                    className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
                    aria-label="Wholesale left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRow(wholesaleRowRef, "right")}
                    className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
                    aria-label="Wholesale right"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div ref={wholesaleRowRef} className="px-4 pb-4 overflow-x-auto scroll-smooth no-scrollbar">
                <div className="flex gap-4 min-w-max">
                  {wholesaleCards.map((w, idx) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => goCategory("deals")}
                      className={[
                        WHOLESALE_CARD_W,
                        "rounded-2xl overflow-hidden border border-black/10 shadow-sm text-left transition hover:ring-2 hover:ring-green-300",
                      ].join(" ")}
                    >
                      <div className={`${idx % 2 === 0 ? TILE_GREEN : TILE_WHITE} p-3`}>
                        <div className="text-xs font-black text-slate-900">{w.title}</div>
                        <div className="text-[11px] text-slate-700">{w.sub}</div>
                        <div className={`relative mt-3 ${WHOLESALE_IMG_H} rounded-xl overflow-hidden bg-white/40`}>
                          <Image src={w.img} alt={w.title} fill className="object-contain p-3" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-2xl border border-black/10 shadow-sm overflow-hidden bg-white">
              <div className="p-4">
                <div className="text-sm font-black text-slate-900">Categories</div>
             
              </div>

              <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                {categoryTiles.slice(0, 6).map((c, idx) => {
                  const bg = idx % 2 === 0 ? TILE_GREEN : TILE_WHITE;
                  return (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() => goCategory((c.key as CategoryKey) ?? "deals")}
                      className={[
                        "rounded-2xl border border-black/10 overflow-hidden text-left transition hover:ring-2 hover:ring-green-300",
                        bg,
                      ].join(" ")}
                      title={c.title}
                    >
                      <div className="p-2">
                        <div className={`relative ${CAT_TILE_IMG_H}`}>
                          <Image src={c.img} alt={c.title} fill className="object-contain p-2" />
                        </div>
                        <div className="mt-1 text-[11px] font-semibold text-slate-900 line-clamp-1">
                          {(t[lang]?.categories as any)?.[c.key] ?? c.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Deals slider */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">{getCategoryLabel("deals", lang)}</h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRow(dealsRowRef, "left")}
                className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollRow(dealsRowRef, "right")}
                className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
              >
                ›
              </button>
            </div>
          </div>

          <div ref={dealsRowRef} className="mt-3 overflow-x-auto scroll-smooth no-scrollbar">
            <div className="flex gap-4 min-w-max pb-2">
              {deals.map((p) => (
                <div key={p.id} className="w-[220px] rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
                  <div className="relative h-[160px] bg-slate-50">
                    <Image src={p.image ?? "/images/front.png"} alt="deal" fill className="object-contain p-4" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold text-slate-900 line-clamp-2">{p.title[lang] ?? p.title.en}</div>
                    <div className="mt-2 text-sm font-black text-slate-900">{formatMoney(p)}</div>
                    <button
                      type="button"
                      onClick={() => add(p, 1)}
                      className="mt-3 w-full bg-[#0b4fb3] text-white text-xs font-semibold py-2 rounded-full hover:opacity-95"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        

        {/* Seasons */}
        <section className="mt-10">
          <div className="rounded-2xl border border-black/10 shadow-sm overflow-hidden bg-white">
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm font-black text-slate-900">Saison</div>
              <div className="text-xs text-slate-600">4 colonnes (desktop) • 6 saisons</div>
            </div>

            <div className={`px-4 pb-4 grid ${SEASON_GRID_COLS} ${SEASON_SECTION_GAP}`}>
              {seasons.map((s, idx) => {
                const bg = idx % 2 === 0 ? TILE_GREEN : TILE_WHITE;
                return (
                  <div
                    key={s.id}
                    className={[
                      "rounded-2xl border border-black/10 overflow-hidden shadow-sm hover:ring-2 hover:ring-green-300 transition",
                      bg,
                    ].join(" ")}
                  >
                    <div className={`relative ${SEASON_TILE_IMG_H} bg-white/40`}>
                      <Image src={s.img} alt={s.title} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-black text-slate-900">{s.title}</div>
                      <div className="text-xs text-slate-600">Season collection</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom ads */}
        <section className="mt-8">
          <AdsCarousel slides={adsSlides} />
        </section>

        {/* Cart Drawer */}
       
      </main>
    </div>
  );
}