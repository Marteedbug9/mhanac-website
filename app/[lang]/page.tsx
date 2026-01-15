"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import RegionToggle from "./components/RegionToggle";

import { t, type Lang } from "./lib/i18n";
import type { CategoryKey, Region } from "./lib/catalog/categories";
import { categoriesByRegion } from "./lib/catalog/categories";
import type { Product } from "./lib/catalog/products";
import { MOCK_PRODUCTS } from "./lib/catalog/products";

type Props = {
  params: { lang: Lang };
};

const TOPBAR_BG = "bg-[#0b4fb3]";
const PAGE_BG = "bg-[#f3f6fb]";

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L22 7H6.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20a1 1 0 1 0 0.001 0ZM18 20a1 1 0 1 0 0.001 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatMoney(p: Product) {
  const n = p.price.toLocaleString();
  return p.currency === "USD" ? `$${n}` : `${n} HTG`;
}

/** ✅ plus de cat.label — on lit dans i18n.ts */
function getLabel(key: CategoryKey, lang: Lang) {
  return t[lang]?.categories?.[key] ?? t.en.categories[key] ?? key;
}

/** ✅ ref type correct */
function scrollRow(
  ref: React.RefObject<HTMLDivElement | null>,
  dir: "left" | "right"
) {
  const el = ref.current;
  if (!el) return;
  const dx = dir === "left" ? -520 : 520;
  el.scrollBy({ left: dx, behavior: "smooth" });
}


export default function HomePage({ params }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const lang = params.lang;

  const [region, setRegion] = useState<Region>("us");
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("deals");

  const catsRowRef = useRef<HTMLDivElement>(null);
  const dealsRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromQuery = sp.get("region") as Region | null;

    const fromLS =
      typeof window !== "undefined"
        ? (localStorage.getItem("MHANAC_REGION") as Region | null)
        : null;

    const defaultRegion: Region = lang === "en" ? "us" : "haiti";
    const r = fromQuery ?? fromLS ?? defaultRegion;

    if (r === "us" || r === "haiti") {
      setRegion(r);
      if (typeof window !== "undefined") localStorage.setItem("MHANAC_REGION", r);
    }

    const cat = sp.get("category") as CategoryKey | null;
    if (cat) setActiveCategory(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => categoriesByRegion(region), [region]);

  const products = useMemo(() => {
    const base = MOCK_PRODUCTS.filter((p) => p.region === region);

    const byCat = base.filter((p) => p.category === activeCategory);

    const byQ = q.trim()
      ? byCat.filter((p) =>
          (p.title[lang] ?? p.title.en).toLowerCase().includes(q.toLowerCase())
        )
      : byCat;

    return byQ;
  }, [region, activeCategory, q, lang]);

  const deals = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.region === region && p.category === "deals");
  }, [region]);

  function goCategory(key: CategoryKey) {
    setActiveCategory(key);
    router.replace(`/${lang}?region=${region}&category=${key}`);
  }

  // ✅ textes via i18n
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

  const shopSections: { key: CategoryKey; title: string; image: string }[] = [
    { key: "electronics", title: i.shopSections.electronics, image: "/images/listproduc/electro.png" },
    { key: "home_kitchen", title: i.shopSections.home_kitchen, image: "/images/listproduc/home.png" },
    { key: "beauty", title: i.shopSections.beauty, image: "/images/listproduc/beauty.png" },
    { key: "fashion", title: i.shopSections.fashion, image: "/images/listproduc/fashion.png" },
    { key: "grocery", title: i.shopSections.grocery, image: "/images/listproduc/groce1.png" },
  ];

  return (
    <div className={`${PAGE_BG} min-h-screen`}>
      {/* ===================== NAVBAR ===================== */}
      <header className={`${TOPBAR_BG} text-white sticky top-0 z-50`}>
        {/* Row 1 */}
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <button
            type="button"
            onClick={() => router.push(`/${lang}?region=${region}&category=${activeCategory}`)}
            className="flex items-center gap-2 min-w-[150px]"
            aria-label="MHANAC Home"
          >
            <div className="relative w-[36px] h-[36px] rounded-lg overflow-hidden bg-white/15">
              <Image
                src="/images/mhanac%20logo1.png"
                alt="MHANAC"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="font-black tracking-wide">MHANAC</div>
          </button>

          {/* Region flags */}
          <div className="flex items-center">
            <RegionToggle />
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "ht" ? "Chèche yon pwodwi..." : lang === "fr" ? "Rechercher..." : "Search products..."}
              className="flex-1 outline-none text-black bg-transparent text-sm"
            />
            <button
              type="button"
              className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-full"
            >
              Go
            </button>
          </div>

          {/* Cart + Login */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert("Cart (demo)")}
              className="relative flex items-center gap-2 rounded-full px-3 py-2 bg-white/10 hover:bg-white/15 transition"
              aria-label="Cart"
              title="Cart"
            >
              <CartIcon className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Cart</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 text-[11px] grid place-items-center rounded-full bg-green-400 text-black font-black">
                0
              </span>
            </button>

            <button
              type="button"
              onClick={() => alert("Login (demo)")}
              className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/15 transition text-sm font-semibold"
            >
              Login
            </button>
          </div>
        </div>

        {/* Row 2 categories navbar */}
        <div className="border-t border-white/10 bg-[#0b4fb3]">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollRow(catsRowRef, "left")}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 transition grid place-items-center"
              aria-label="Categories left"
            >
              ‹
            </button>

            <div ref={catsRowRef} className="flex-1 overflow-x-auto scroll-smooth no-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                {categories.map((c) => {
                  const active = c.key === activeCategory;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => goCategory(c.key)}
                      className={[
                        "group relative px-3 py-2 rounded-full bg-transparent transition",
                        "hover:bg-white/10 active:scale-[0.98]",
                        active ? "bg-white/15" : "",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{c.icon ?? "🛍️"}</span>
                        <span
                          className={[
                            "text-sm font-semibold whitespace-nowrap transition-transform duration-200",
                            "group-hover:scale-[1.07] group-hover:text-green-300",
                            active ? "text-green-300" : "text-white",
                          ].join(" ")}
                        >
                          {getLabel(c.key, lang)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollRow(catsRowRef, "right")}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 transition grid place-items-center"
              aria-label="Categories right"
            >
              ›
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MAIN ===================== */}
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6">
        {/* promos left + diaspora right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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

        {/* DEALS slider */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">{getLabel("deals", lang)}</h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRow(dealsRowRef, "left")}
                className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
                aria-label="Deals left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollRow(dealsRowRef, "right")}
                className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
                aria-label="Deals right"
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
                    <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                      {p.title[lang] ?? p.title.en}
                    </div>
                    <div className="mt-2 text-sm font-black text-slate-900">{formatMoney(p)}</div>
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

        {/* Popular categories */}
        <section className="mt-10">
          <h3 className="text-lg font-black text-slate-900">
            {lang === "fr" ? "Catégories populaires" : lang === "ht" ? "Kategori popilè" : "Popular categories"}
          </h3>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {shopSections.map((s) => {
              const best = MOCK_PRODUCTS.filter((p) => p.region === region && p.category === s.key).slice(0, 4);

              return (
                <div key={s.key} className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-900">{s.title}</div>
                      <div className="text-xs text-slate-600">Top sellers</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => goCategory(s.key)}
                      className="bg-[#0b4fb3] text-white text-xs font-semibold px-4 py-2 rounded-full"
                    >
                      Shop
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                    {best.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goCategory(s.key)}
                        className="text-left rounded-xl border border-black/10 hover:ring-2 hover:ring-green-300 transition overflow-hidden"
                      >
                        <div className="relative h-[110px] bg-slate-50">
                          <Image src={p.image ?? s.image} alt="prod" fill className="object-contain p-3" />
                        </div>
                        <div className="p-3">
                          <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                            {p.title[lang] ?? p.title.en}
                          </div>
                          <div className="mt-1 text-xs font-black text-slate-900">{formatMoney(p)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Products grid */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {lang === "fr" ? "Produits" : lang === "ht" ? "Pwodwi" : "Products"}
              </h2>
              <div className="text-xs text-slate-600">
                Region: <b>{region.toUpperCase()}</b> • Category: <b>{activeCategory}</b> • {products.length} results
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <div key={p.id} className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
                <div className="relative h-[150px] bg-slate-50">
                  <Image src={p.image ?? "/images/front.png"} alt={p.title.en} fill className="object-contain p-4" />
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                    {p.title[lang] ?? p.title.en}
                  </div>
                  <div className="mt-2 text-sm font-black text-slate-900">{formatMoney(p)}</div>
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
      </main>

      {/* Footer */}
      <footer className="mt-12">
        <div className="h-10 bg-gradient-to-b from-[#e9eef6] to-white" />
        <div className="bg-white border-t border-black/5">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600">
            <div className="font-black text-slate-900">MHANAC</div>
            <div className="mt-2">Wholesale • C-Store • Online — USA & Haiti</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
