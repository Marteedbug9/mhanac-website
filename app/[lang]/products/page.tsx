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

const TOPBAR_BG = "bg-[#0b4fb3]"; // bleu type walmart
const PAGE_BG = "bg-[#f3f6fb]";

function formatMoney(p: Product) {
  const n = p.price.toLocaleString();
  return p.currency === "USD" ? `$${n}` : `${n} HTG`;
}

/** ✅ plus de cat.label : on lit depuis i18n.ts */
function getCategoryLabel(key: CategoryKey, lang: Lang) {
  return t[lang]?.categories?.[key] ?? t.en.categories[key] ?? key;
}

/** ✅ ref sans null pour éviter checks partout */
function scrollRow(
  ref: React.RefObject<HTMLDivElement | null>,
  dir: "left" | "right"
) {
  const el = ref.current;
  if (!el) return;
  const dx = dir === "left" ? -520 : 520;
  el.scrollBy({ left: dx, behavior: "smooth" });
}


export default function ProductsPage({ params }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = params.lang;

  // region venant du query, sinon localStorage, sinon default
  const [region, setRegion] = useState<Region>("us");
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("deals");

  // sliders refs
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

    const filteredByCat = base.filter((p) => p.category === activeCategory);
    const filteredByQ = q.trim()
      ? filteredByCat.filter((p) =>
          (p.title[lang] ?? p.title.en).toLowerCase().includes(q.toLowerCase())
        )
      : filteredByCat;

    return filteredByQ;
  }, [region, activeCategory, q, lang]);

  const deals = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.region === region && p.category === "deals");
  }, [region]);

  function goRegion(next: Region) {
    setRegion(next);
    if (typeof window !== "undefined") localStorage.setItem("MHANAC_REGION", next);

    // ✅ force langue par region
    const forcedLang: Lang = next === "us" ? "en" : "ht";

    // ✅ garde la même catégorie active
    router.push(`/${forcedLang}/products?region=${next}&category=${activeCategory}`);
  }

  function goCategory(key: CategoryKey) {
    setActiveCategory(key);
    router.replace(`/${lang}/products?region=${region}&category=${key}`);
  }

  // ✅ textes traduits via i18n
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

  const shopSections: { key: CategoryKey; title: string; image: string }[] = [
    { key: "electronics", title: i.shopSections.electronics, image: "/images/listproduc/electro.png" },
    { key: "home_kitchen", title: i.shopSections.home_kitchen, image: "/images/listproduc/home.png" },
    { key: "beauty", title: i.shopSections.beauty, image: "/images/listproduc/beauty.png" },
    { key: "fashion", title: i.shopSections.fashion, image: "/images/listproduc/fashion.png" },
    { key: "grocery", title: i.shopSections.grocery, image: "/images/listproduc/groce1.png" },
  ];

  return (
    <div className={`${PAGE_BG} min-h-screen`}>
      {/* ===================== TOP BAR (bleu) ===================== */}
      <header className={`${TOPBAR_BG} text-white sticky top-0 z-50`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center gap-3">
          {/* Logo left */}
          <button
            type="button"
            onClick={() => router.push(`/${lang}/products?region=${region}&category=${activeCategory}`)}
            className="flex items-center gap-2 min-w-[150px]"
            aria-label="MHANAC Home"
          >
            <div className="relative w-[34px] h-[34px] rounded-lg overflow-hidden bg-white/15">
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

          {/* Flags region */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goRegion("us")}
              className={[
                "relative w-[44px] h-[28px] rounded-md overflow-hidden border",
                region === "us" ? "border-green-400" : "border-white/30 hover:border-white/70",
              ].join(" ")}
              aria-label="USA"
              title="USA"
            >
              <Image src="/images/usa.png" alt="USA" fill className="object-contain bg-white/10" />
            </button>

            <button
              type="button"
              onClick={() => goRegion("haiti")}
              className={[
                "relative w-[44px] h-[28px] rounded-md overflow-hidden border",
                region === "haiti" ? "border-green-400" : "border-white/30 hover:border-white/70",
              ].join(" ")}
              aria-label="Haiti"
              title="Haiti"
            >
              <Image src="/images/haiti.png" alt="Haiti" fill className="object-contain bg-white/10" />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm">
            <div className="relative w-5 h-5 opacity-70">
              <Image src="/images/search.png" alt="search" fill className="object-contain" />
            </div>
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
        </div>
      </header>

      {/* ===================== CATEGORIES HORIZONTAL (gris) ===================== */}
      <section className="bg-[#e9eef6] border-b border-black/5">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollRow(catsRowRef, "left")}
              className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
              aria-label="Scroll left categories"
            >
              ‹
            </button>

            <div ref={catsRowRef} className="flex-1 overflow-x-auto scroll-smooth no-scrollbar">
              <div className="flex gap-3 min-w-max">
                {categories.map((c) => {
                  const active = c.key === activeCategory;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => goCategory(c.key)}
                      className={[
                        "bg-white border border-black/10 rounded-xl px-4 py-2 flex items-center gap-2",
                        "transition",
                        active ? "ring-2 ring-green-400" : "hover:ring-2 hover:ring-green-300",
                      ].join(" ")}
                    >
                      <span className="text-base">{c.icon ?? "🛍️"}</span>
                      <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                        {getCategoryLabel(c.key, lang)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollRow(catsRowRef, "right")}
              className="w-9 h-9 rounded-full bg-white shadow grid place-items-center hover:ring-2 hover:ring-green-400"
              aria-label="Scroll right categories"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* ===================== MAIN GRID ===================== */}
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6">
        {/* Top content: 2 promos left + diaspora right */}
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

        {/* ===================== DEALS SLIDER ===================== */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">{getCategoryLabel("deals", lang)}</h2>

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
                <div
                  key={p.id}
                  className="w-[220px] rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden"
                >
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

        {/* ===================== CATEGORY “SHOP SECTIONS” ===================== */}
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

        {/* ===================== PRODUCTS GRID ===================== */}
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

      {/* ===================== FOOTER ===================== */}
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
