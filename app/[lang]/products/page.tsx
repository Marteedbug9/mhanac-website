"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { t, type Lang } from "../lib/i18n";
import type { CategoryKey, Region } from "../lib/catalog/categories";
import { categoriesByRegion } from "../lib/catalog/categories";
import type { Product } from "../lib/catalog/products";
import { MOCK_PRODUCTS } from "../lib/catalog/products";

type Props = {
  params: { lang: Lang };
};

const PAGE_BG = "bg-[#E4FCE3]";
const STORAGE_KEY = "MHANAC_REGION";

/* =========================================================
   ✅ QUICK EDIT ZONE (change here fast)
   ---------------------------------------------------------
   COLORS / GRID
========================================================= */
const TILE_GREEN = "bg-[#E1EDDD]";
const TILE_WHITE = "bg-white";

/* =========================================================
   ✅ SIZE / POSITION QUICK EDIT
========================================================= */
// Wholesale/cards sizes
const WHOLESALE_CARD_W = "w-[260px]";
const WHOLESALE_IMG_H = "h-[130px]";
const CAT_TILE_IMG_H = "h-[92px]";
const WHOLESALE_SCROLL_DX = 520; // scroll px for arrows

// Seasons tiles sizes
const SEASON_TILE_IMG_H = "h-[150px] sm:h-[170px] md:h-[190px]";
const SEASON_GRID_COLS = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"; // ✅ 4 colonnes sur desktop
const SEASON_SECTION_GAP = "gap-4";

// Auto marquee speed (lower = faster)
const MARQUEE_DURATION_SLOW = 28; // seconds
const MARQUEE_DURATION_FAST = 18; // seconds

// Ads carousel
const ADS_AUTOPLAY_MS = 3500;

/* =========================
   HELPERS (Region ↔ Lang)
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

function scrollRow(
  ref: React.RefObject<HTMLDivElement | null>,
  dir: "left" | "right"
) {
  const el = ref.current;
  if (!el) return;
  el.scrollBy({
    left: dir === "left" ? -WHOLESALE_SCROLL_DX : WHOLESALE_SCROLL_DX,
    behavior: "smooth",
  });
}

/* =========================================================
   ✅ Small component: Auto marquee row (left<->right)
========================================================= */
function AutoMarqueeRow({
  items,
  direction,
  durationSec,
}: {
  items: Product[];
  direction: "left" | "right";
  durationSec: number;
}) {
  // duplicate list to loop seamlessly
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <div className="text-sm font-black text-slate-900">
          {direction === "left" ? "Trending (→)" : "Trending (←)"}
        </div>
        <div className="text-xs text-slate-600">
          Auto-scroll • {durationSec}s
        </div>
      </div>

      <div className="px-4 pb-4">
        <div
          className={[
            "flex gap-4 w-max",
            direction === "left" ? "marquee-left" : "marquee-right",
          ].join(" ")}
          style={{ ["--marquee-duration" as any]: `${durationSec}s` }}
        >
          {doubled.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="w-[220px] rounded-2xl border border-black/10 overflow-hidden bg-white"
            >
              <div className="relative h-[150px] bg-slate-50">
                <Image
                  src={p.image ?? "/images/front.png"}
                  alt={p.title.en}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                  {p.title.en}
                </div>
                <div className="mt-2 text-sm font-black text-slate-900">
                  {formatMoney(p)}
                </div>
                <button
                  type="button"
                  className="mt-3 w-full bg-[#0b4fb3] text-white text-xs font-semibold py-2 rounded-full"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS (scoped) */}
      <style jsx>{`
        .marquee-left {
          animation: marqueeLeft var(--marquee-duration) linear infinite;
        }
        .marquee-right {
          animation: marqueeRight var(--marquee-duration) linear infinite;
        }
        @keyframes marqueeLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes marqueeRight {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   ✅ Ads Carousel (3 images)
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
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % slides.length);
    }, autoplayMs);
    return () => clearInterval(t);
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
        <Image
          src={slides[idx]?.image}
          alt={slides[idx]?.title ?? "ad"}
          fill
          className="object-cover"
          priority
        />

        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

        {/* arrows */}
        <button
          type="button"
          onClick={() => go(idx - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/90 grid place-items-center shadow hover:scale-105 transition"
          aria-label="Prev"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(idx + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/90 grid place-items-center shadow hover:scale-105 transition"
          aria-label="Next"
        >
          ›
        </button>

        {/* dots */}
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

export default function ProductsPage({ params }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = params.lang;

  const [region, setRegion] = useState<Region>("us");
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("deals");

  // sliders refs
  const dealsRowRef = useRef<HTMLDivElement>(null);
  const wholesaleRowRef = useRef<HTMLDivElement>(null);

  // ✅ Init + FORCE URL lang to match region (USA => /en, Haiti => /ht)
  useEffect(() => {
    const fromQuery = sp.get("region") as Region | null;
    const fromLS =
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as Region | null)
        : null;

    const defaultRegion: Region = lang === "en" ? "us" : "haiti";

    const r: Region =
      (isRegion(fromQuery) && fromQuery) ||
      (isRegion(fromLS) && fromLS) ||
      defaultRegion;

    setRegion(r);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, r);

    const cat = (sp.get("category") as CategoryKey | null) ?? "deals";
    setActiveCategory(cat);

    const forcedLang = langForRegion(r);
    if (forcedLang !== lang) {
      const params = new URLSearchParams(sp.toString());
      params.set("region", r);
      params.set("category", cat);
      if (q.trim()) params.set("q", q.trim());
      router.replace(`/${forcedLang}/products?${params.toString()}`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => categoriesByRegion(region), [region]);

  const products = useMemo(() => {
    const base = MOCK_PRODUCTS.filter((p) => p.region === region);
    const filteredByCat = base.filter((p) => p.category === activeCategory);

    return q.trim()
      ? filteredByCat.filter((p) =>
          (p.title[lang] ?? p.title.en).toLowerCase().includes(q.toLowerCase())
        )
      : filteredByCat;
  }, [region, activeCategory, q, lang]);

  const deals = useMemo(() => {
    return MOCK_PRODUCTS.filter(
      (p) => p.region === region && p.category === "deals"
    );
  }, [region]);

  function goCategory(key: CategoryKey) {
    setActiveCategory(key);

    const params = new URLSearchParams(sp.toString());
    params.set("region", region);
    params.set("category", key);

    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");

    router.replace(`/${lang}/products?${params.toString()}`);
  }

  const i = t[lang]?.productsPage ?? t.en.productsPage;

  const promoSlides = [
    {
      id: "promo1",
      title: i.promos.p1_title,
      subtitle: i.promos.p1_sub,
      image: "/images/front.png",
    },
    {
      id: "promo2",
      title: i.promos.p2_title,
      subtitle: i.promos.p2_sub,
      image: "/images/front.png",
    },
  ];

  const diasporaCards = [
    {
      id: "d1",
      title: i.diaspora.d1_title,
      subtitle: i.diaspora.d1_sub,
      image: "/images/listproduc/groce1.png",
    },
    {
      id: "d2",
      title: i.diaspora.d2_title,
      subtitle: i.diaspora.d2_sub,
      image: "/images/listproduc/home.png",
    },
    {
      id: "d3",
      title: i.diaspora.d3_title,
      subtitle: i.diaspora.d3_sub,
      image: "/images/listproduc/electro.png",
    },
  ];

  /* =========================
     ✅ WHOLESALE + RIGHT categories
========================= */
  const categoryTiles = [
    { key: "grocery" as CategoryKey, title: "Grocery", img: "/images/listproduc/grocery.png" },
    { key: "home_kitchen" as CategoryKey, title: "Home", img: "/images/listproduc/home.png" },
    { key: "beauty" as CategoryKey, title: "Beauty", img: "/images/listproduc/beauty.png" },
    { key: "electronics" as CategoryKey, title: "Electronics", img: "/images/listproduc/electro.png" },
    { key: "fashion" as CategoryKey, title: "Fashion", img: "/images/listproduc/fashion.png" },
    { key: "baby" as any, title: "Baby", img: "/images/listproduc/baby.png" },
  ];

  const wholesaleCards = [
    { id: "w1", title: "Wholesale", sub: "Bulk price • Fast delivery", img: "/images/listproduc/groce1.png" },
    { id: "w2", title: "Wholesale", sub: "C-Store • Grocery • Home", img: "/images/listproduc/grocery.png" },
    { id: "w3", title: "Wholesale", sub: "Electronics • Beauty • Fashion", img: "/images/listproduc/electro.png" },
  ];

  /* =========================
     ✅ NEW: Seasons grid (tes images)
     STYLE: 1 horizontal header + grid 4 cols (desktop)
========================= */
  const seasons = [
    { id: "s1", title: "Valentin", img: "/images/saison/valentin.jpg" },
    { id: "s2", title: "Summer", img: "/images/saison/summer.jpg" },
    { id: "s3", title: "Winter", img: "/images/saison/carnaval.jpg" }, // (tu peux changer si tu ajoutes winter.jpg)
    { id: "s4", title: "Halloween", img: "/images/saison/halloween.jpg" },
    { id: "s5", title: "Fall", img: "/images/saison/fall.jpg" },
    { id: "s6", title: "Spring", img: "/images/saison/sprin.png" },
  ];

  /* =========================
     ✅ NEW: Ads carousel images (3)
     -> change images here
========================= */
  const adsSlides = [
    { id: "ad1", image: "/images/front.png", title: "Ad 1" },
    { id: "ad2", image: "/images/front.png", title: "Ad 2" },
    { id: "ad3", image: "/images/front.png", title: "Ad 3" },
  ];

  /* =========================
     ✅ NEW: 2 auto scrolling lists
     -> choose products you want
========================= */
  const listA = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.region === region).slice(0, 10);
  }, [region]);

  const listB = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.region === region).slice(6, 16);
  }, [region]);

  return (
    <div className={`${PAGE_BG} min-h-screen w-full`}>
      <main className="w-full px-3 sm:px-4 py-5">

         <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AutoMarqueeRow
            items={listA}
            direction="left"
            durationSec={MARQUEE_DURATION_SLOW}
          />
          <AutoMarqueeRow
            items={listB}
            direction="right"
            durationSec={MARQUEE_DURATION_FAST}
          />
        </section>

        {/* promos + diaspora */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {promoSlides.map((s) => (
              <div
                key={s.id}
                className="relative overflow-hidden rounded-2xl bg-white border border-black/10 shadow-sm min-h-[190px]"
              >
                <div className="absolute inset-0">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40" />
                </div>
                <div className="relative p-5">
                  <div className="text-sm font-bold text-slate-900">
                    {s.title}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {s.subtitle}
                  </div>
                  <button
                    type="button"
                    onClick={() => goCategory("deals")}
                    className="mt-4 inline-flex items-center gap-2 bg-[#0b4fb3] text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-95"
                  >
                    Shoop <span>›</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 gap-4">
            {diasporaCards.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="text-xs font-bold text-slate-900">
                    {d.title}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {d.subtitle}
                  </div>
                </div>
                <div className="relative h-[150px] bg-gradient-to-b from-white to-slate-50">
                  <Image
                    src={d.image}
                    alt={d.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <button
                    type="button"
                    onClick={() => goCategory("deals")}
                    className="bg-[#0b4fb3] text-white text-xs font-semibold px-4 py-2 rounded-full"
                  >
                    Shop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
             {/* =========================================================
            ✅ NEW: Ads carousel (3 images)
        ========================================================= */}
        <section className="mt-8">
          <AdsCarousel slides={adsSlides} />
        </section>

        {/* ✅ NEW BLOCK: WHOLESALE (left) + 2x3 categories (right) */}
        <section className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* LEFT: Wholesale slider */}
            <div className="lg:col-span-8 rounded-2xl border border-black/10 shadow-sm overflow-hidden bg-white">
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-slate-900">
                    Wholesale
                  </div>
                  <div className="text-xs text-slate-600">
                    Horizontal diaporama
                  </div>
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

              <div
                ref={wholesaleRowRef}
                className="px-4 pb-4 overflow-x-auto scroll-smooth no-scrollbar"
              >
                <div className="flex gap-4 min-w-max">
                  {wholesaleCards.map((w, idx) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => goCategory("deals")}
                      className={[
                        WHOLESALE_CARD_W,
                        "rounded-2xl overflow-hidden border border-black/10 shadow-sm text-left",
                        "transition hover:ring-2 hover:ring-green-300",
                      ].join(" ")}
                    >
                      {/* ✅ alternance vert/blanc */}
                      <div className={`${idx % 2 === 0 ? TILE_GREEN : TILE_WHITE} p-3`}>
                        <div className="text-xs font-black text-slate-900">
                          {w.title}
                        </div>
                        <div className="text-[11px] text-slate-700">{w.sub}</div>
                        <div
                          className={`relative mt-3 ${WHOLESALE_IMG_H} rounded-xl overflow-hidden bg-white/40`}
                        >
                          <Image
                            src={w.img}
                            alt={w.title}
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: 2 rows x 3 cols categories */}
            <div className="lg:col-span-4 rounded-2xl border border-black/10 shadow-sm overflow-hidden bg-white">
              <div className="p-4">
                <div className="text-sm font-black text-slate-900">
                  Categories
                </div>
                <div className="text-xs text-slate-600">
                  2 rangées • 3 colonnes
                </div>
              </div>

              <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                {categoryTiles.slice(0, 6).map((c, idx) => {
                  const bg = idx % 2 === 0 ? TILE_GREEN : TILE_WHITE;
                  return (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() =>
                        goCategory((c.key as CategoryKey) ?? "deals")
                      }
                      className={[
                        "rounded-2xl border border-black/10 overflow-hidden text-left",
                        "transition hover:ring-2 hover:ring-green-300",
                        bg,
                      ].join(" ")}
                      title={c.title}
                    >
                      <div className="p-2">
                        <div className={`relative ${CAT_TILE_IMG_H}`}>
                          <Image
                            src={c.img}
                            alt={c.title}
                            fill
                            className="object-contain p-2"
                          />
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
            <h2 className="text-lg font-black text-slate-900">
              {getCategoryLabel("deals", lang)}
            </h2>

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

          <div
            ref={dealsRowRef}
            className="mt-3 overflow-x-auto scroll-smooth no-scrollbar"
          >
            <div className="flex gap-4 min-w-max pb-2">
              {deals.map((p) => (
                <div
                  key={p.id}
                  className="w-[220px] rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden"
                >
                  <div className="relative h-[160px] bg-slate-50">
                    <Image
                      src={p.image ?? "/images/front.png"}
                      alt="deal"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                      {p.title[lang] ?? p.title.en}
                    </div>
                    <div className="mt-2 text-sm font-black text-slate-900">
                      {formatMoney(p)}
                    </div>
                    <button
                      type="button"
                      onClick={() => goCategory("deals")}
                      className="mt-3 w-full bg-[#0b4fb3] text-white text-xs font-semibold py-2 rounded-full"
                    >
                      Shop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {lang === "fr"
                  ? "Produits"
                  : lang === "ht"
                  ? "Pwodwi"
                  : "Products"}
              </h2>
              <div className="text-xs text-slate-600">
                Region: <b>{region.toUpperCase()}</b> • Category:{" "}
                <b>{activeCategory}</b> • {products.length} results
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden"
              >
                <div className="relative h-[150px] bg-slate-50">
                  <Image
                    src={p.image ?? "/images/front.png"}
                    alt={p.title.en}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                    {p.title[lang] ?? p.title.en}
                  </div>
                  <div className="mt-2 text-sm font-black text-slate-900">
                    {formatMoney(p)}
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full bg-[#0b4fb3] text-white text-xs font-semibold py-2 rounded-full"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            ✅ NEW: SAISONS (en bas products)
            - 1 bande horizontale + grille 4 colonnes (desktop)
        ========================================================= */}
        <section className="mt-10">
          {/* 1 horizontal bar */}
          <div className="rounded-2xl border border-black/10 shadow-sm overflow-hidden bg-white">
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm font-black text-slate-900">Saison</div>
              <div className="text-xs text-slate-600">
                4 colonnes (desktop) • 6 saisons
              </div>
            </div>

            {/* grid 4 columns */}
            <div className={`px-4 pb-4 grid ${SEASON_GRID_COLS} ${SEASON_SECTION_GAP}`}>
              {seasons.map((s, idx) => {
                const bg = idx % 2 === 0 ? TILE_GREEN : TILE_WHITE;
                return (
                  <div
                    key={s.id}
                    className={[
                      "rounded-2xl border border-black/10 overflow-hidden shadow-sm",
                      "hover:ring-2 hover:ring-green-300 transition",
                      bg,
                    ].join(" ")}
                  >
                    <div className={`relative ${SEASON_TILE_IMG_H} bg-white/40`}>
                      <Image
                        src={s.img}
                        alt={s.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-black text-slate-900">
                        {s.title}
                      </div>
                      <div className="text-xs text-slate-600">
                        Season collection
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            ✅ NEW: 2 auto scrolling lists (right->left & left->right)
        ========================================================= */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AutoMarqueeRow
            items={listA}
            direction="left"
            durationSec={MARQUEE_DURATION_SLOW}
          />
          <AutoMarqueeRow
            items={listB}
            direction="right"
            durationSec={MARQUEE_DURATION_FAST}
          />
        </section>

        {/* =========================================================
            ✅ NEW: Ads carousel (3 images)
        ========================================================= */}
        <section className="mt-8">
          <AdsCarousel slides={adsSlides} />
        </section>
      </main>
    </div>
  );
}
