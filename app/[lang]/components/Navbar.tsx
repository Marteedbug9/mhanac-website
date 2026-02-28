"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Lang } from "../lib/i18n";
import { t } from "../lib/i18n";
import type { CategoryKey, Region } from "../lib/catalog/categories";
import { categoriesByRegion } from "../lib/catalog/categories";
import type { Product } from "../lib/catalog/products";

import { useCart } from "@/app/providers/CartProvider";

const STORAGE_KEY = "MHANAC_REGION";

// ✅ même bleu
const BLUE_BG = "bg-[#0b4fb3]";

// ✅ “loop / glass”
const GLASS_BAR =
  "bg-black/35 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]";

function isRegion(v: any): v is Region {
  return v === "us" || v === "haiti";
}

function forceLang(region: Region): Lang {
  return region === "us" ? "en" : "ht";
}

/** ✅ retire le prefix /en /ht /fr /es du pathname */
function stripLangPrefix(pathname: string) {
  return pathname.replace(/^\/(en|ht|fr|es)(?=\/|$)/, "") || "/";
}

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
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

/* =========================================================
   ✅ CartDrawer (dans le Navbar)
========================================================= */
function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
  remove,
  setQty,
  currencyLabel,
  clear,
}: {
  open: boolean;
  onClose: () => void;
  items: { id: string; qty: number; product: Product }[];
  subtotal: number;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  currencyLabel: string;
  clear: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-[92vw] sm:w-[420px] bg-white z-[101] shadow-2xl flex flex-col"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="p-4 border-b border-black/10 flex items-center justify-between">
              <div className="text-sm font-black text-slate-900">Your Cart</div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full border border-black/10 hover:ring-2 hover:ring-green-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto space-y-3">
              {items.length === 0 ? (
                <div className="text-sm text-slate-600">Cart is empty.</div>
              ) : (
                items.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-2xl border border-black/10 p-3 flex gap-3"
                  >
                    <div className="relative w-16 h-16 rounded-xl bg-slate-50 overflow-hidden">
                      <Image
                        src={it.product.image ?? "/images/front.png"}
                        alt="item"
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900 line-clamp-2">
                        {it.product.title.en}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm font-black text-slate-900">
                          {it.product.price.toLocaleString()} {currencyLabel}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="w-8 h-8 rounded-full border border-black/10 hover:ring-2 hover:ring-green-300"
                          >
                            −
                          </button>
                          <div className="w-8 text-center text-sm font-bold">{it.qty}</div>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="w-8 h-8 rounded-full border border-black/10 hover:ring-2 hover:ring-green-300"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => remove(it.id)}
                        className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-black/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-black text-slate-900">
                  {subtotal.toLocaleString()} {currencyLabel}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={clear}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:ring-2 hover:ring-green-300"
                >
                  Clear
                </button>
                <button className="rounded-xl bg-[#0b4fb3] text-white px-4 py-2 text-sm font-semibold hover:opacity-95">
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default function Navbar({ lang }: { lang: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [region, setRegion] = useState<Region>("us");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("deals");

  // ✅ Cart context
  const { count, items, subtotal, remove, setQty, clear, open, setOpen } = useCart();

  // Init region + activeCategory
  useEffect(() => {
    const fromUrl = sp.get("region");
    const fromLS = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    const r: Region =
      (isRegion(fromUrl) && fromUrl) ||
      (isRegion(fromLS) && fromLS) ||
      (lang === "en" ? "us" : "haiti");

    setRegion(r);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, r);

    const cat = (sp.get("category") as CategoryKey | null) ?? "deals";
    setActiveCategory(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => categoriesByRegion(region), [region]);

  function goRegion(next: Region) {
    setRegion(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next);

    const nextLang = forceLang(next);
    const restPath = stripLangPrefix(pathname);
    const params = new URLSearchParams(sp.toString());

    params.set("region", next);
    if (!params.get("category")) params.set("category", activeCategory);

    router.push(`/${nextLang}${restPath}?${params.toString()}`);
  }

  function goCategory(key: CategoryKey) {
    setActiveCategory(key);
    const params = new URLSearchParams(sp.toString());
    params.set("region", region);
    params.set("category", key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function label(key: CategoryKey) {
    return t[lang]?.categories?.[key] ?? t.en.categories[key] ?? key;
  }

  const currencyLabel = region === "us" ? "USD" : "HTG";

  return (
    <header className={`${BLUE_BG} text-white w-full sticky top-0 z-50`}>
      {/* ===== TOP “GLASS LOOP BAR” ===== */}
      <div className="w-full px-3 sm:px-6 py-3">
        <div
          className={[
            GLASS_BAR,
            "w-full rounded-md px-3 sm:px-4 py-2",
            "flex items-center justify-between gap-3",
          ].join(" ")}
        >
          {/* ✅ Logo + Name (seulement) */}
          <button
            onClick={() => {
              const params = new URLSearchParams(sp.toString());
              params.set("region", region);
              if (!params.get("category")) params.set("category", activeCategory);
              router.push(`/${lang}/products?${params.toString()}`);
            }}
            className="flex items-center gap-2 min-w-[140px]"
            aria-label="MHANAC Home"
          >
            <div className="relative w-9 h-9 rounded-md bg-white/10 overflow-hidden">
              <Image
                src="/images/mhanac%20logo1.png"
                alt="MHANAC"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="font-semibold text-sm sm:text-base">Mhanac</span>
          </button>

          {/* ✅ Right side: Flags + Cart + Login */}
          <div className="flex items-center gap-2">
            {/* Flags */}
            <button
              type="button"
              onClick={() => goRegion("us")}
              className={[
                "rounded-sm p-1 border transition",
                region === "us" ? "border-green-400 bg-white" : "bg-white",
              ].join(" ")}
              aria-label="USA"
              title="USA"
            >
              <Image src="/images/usa.png" alt="USA" width={28} height={18} />
            </button>

            <button
              type="button"
              onClick={() => goRegion("haiti")}
              className={[
                "rounded-sm p-1 border transition",
                region === "haiti" ? "border-green-400 bg-white" : "bg-white",
              ].join(" ")}
              aria-label="Haiti"
              title="Haiti"
            >
              <Image src="/images/haiti.png" alt="Haiti" width={28} height={18} />
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative ml-1 p-2 rounded-sm bg-white/10 hover:bg-white/15 transition"
              aria-label="Cart"
              title="Cart"
            >
              <CartIcon className="w-5 h-5 text-white" />
              <span className="absolute -top-2 -right-2 bg-green-400 text-black text-[11px] w-5 h-5 rounded-full grid place-items-center font-bold">
                {count}
              </span>
            </button>

            {/* Login / Sign in */}
            <button
              type="button"
              onClick={() => router.push(`/${lang}/login`)}
              className="ml-1 px-3 py-2 rounded-sm bg-transparent hover:bg-white/10 transition text-sm font-semibold"
            >
              Login / Sign in
            </button>
          </div>
        </div>
      </div>

      {/* ===== CATEGORY LINE (je la garde, car tu ne l'as pas demandé de supprimer) ===== */}
      <div className="w-full bg-white">
        <div className="w-full px-3 sm:px-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-3">
            {categories.map((c) => {
              const active = c.key === activeCategory;

              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => goCategory(c.key)}
                  className={[
                    "group relative px-4 py-2 rounded-md transition",
                    active ? "text-slate-900 font-semibold" : "text-slate-500",
                    "hover:text-green-600",
                  ].join(" ")}
                >
                  <span className="inline-flex items-center gap-2 transform transition-transform duration-200 group-hover:scale-110">
                    <span className="text-base">{c.icon ?? "•"}</span>
                    <span className="text-sm capitalize">{label(c.key)}</span>
                  </span>

                  <span
                    className={[
                      "absolute left-3 right-3 -bottom-1 h-[2px] rounded-full",
                      "opacity-0 group-hover:opacity-100 transition",
                      "bg-green-500/70",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-[4px] bg-black/50" />
      </div>

      {/* ✅ Cart Drawer rendu ici */}
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        subtotal={subtotal}
        remove={remove}
        setQty={setQty}
        currencyLabel={currencyLabel}
        clear={clear}
      />
    </header>
  );
}