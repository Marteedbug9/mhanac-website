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

const PAGE_BG = "bg-[#f3f6fb]";

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
  el.scrollBy({ left: dir === "left" ? -520 : 520, behavior: "smooth" });
}

export default function ProductsPage({ params }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = params.lang;

  const [region, setRegion] = useState<Region>("us");
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("deals");

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

    return q.trim()
      ? filteredByCat.filter((p) =>
          (p.title[lang] ?? p.title.en).toLowerCase().includes(q.toLowerCase())
        )
      : filteredByCat;
  }, [region, activeCategory, q, lang]);

  const deals = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.region === region && p.category === "deals");
  }, [region]);

  function goCategory(key: CategoryKey) {
    setActiveCategory(key);
    router.replace(`/${lang}/products?region=${region}&category=${key}`);
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

  const shopSections: { key: CategoryKey; title: string; image: string }[] = [
    { key: "electronics", title: i.shopSections.electronics, image: "/images/listproduc/electro.png" },
    { key: "home_kitchen", title: i.shopSections.home_kitchen, image: "/images/listproduc/home.png" },
    { key: "beauty", title: i.shopSections.beauty, image: "/images/listproduc/beauty.png" },
    { key: "fashion", title: i.shopSections.fashion, image: "/images/listproduc/fashion.png" },
    { key: "grocery", title: i.shopSections.grocery, image: "/images/listproduc/groce1.png" },
  ];

  return (
    <div className={`${PAGE_BG} min-h-screen w-full`}>
      {/* ✅ MAIN prend toute la largeur, pas de max-w-7xl */}
      <main className="w-full px-3 sm:px-6 py-6">
        {/* promos + diaspora */}
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

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
    </div>
  );
}
