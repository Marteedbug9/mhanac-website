"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Lang } from "../lib/i18n";
import { t } from "../lib/i18n";
import type { CategoryKey, Region } from "../lib/catalog/categories";
import { categoriesByRegion } from "../lib/catalog/categories";

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

export default function Navbar({ lang }: { lang: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [region, setRegion] = useState<Region>("us");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("deals");

  useEffect(() => {
    const fromUrl = sp.get("region");
    const fromLS =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    const r =
      (isRegion(fromUrl) && fromUrl) || (isRegion(fromLS) && fromLS) || "us";

    setRegion(r);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, r);
  }, [sp]);

  const categories = useMemo(() => categoriesByRegion(region), [region]);

  function goRegion(next: Region) {
    setRegion(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next);

    const nextLang = forceLang(next);
    const params = new URLSearchParams(sp.toString());
    params.set("region", next);

    router.push(`/${nextLang}${pathname.replace(/^\/(en|fr|ht|es)/, "")}?${params.toString()}`);
  }

  function goCategory(key: CategoryKey) {
    setActiveCategory(key);
    const params = new URLSearchParams(sp.toString());
    params.set("category", key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function label(key: CategoryKey) {
    return t[lang]?.categories?.[key] ?? t.en.categories[key] ?? key;
  }

  return (
    <header className={`${BLUE_BG} text-white w-full sticky top-0 z-50`}>
      {/* ===== TOP “GLASS LOOP BAR” (comme ton screenshot) ===== */}
      <div className="w-full px-3 sm:px-6 py-3">
        <div
          className={[
            GLASS_BAR,
            "w-full rounded-md px-3 sm:px-4 py-2",
            "flex items-center gap-3",
          ].join(" ")}
        >
          {/* Logo + Name */}
          <button
            onClick={() => router.push(`/${lang}?region=${region}`)}
            className="flex items-center gap-2 min-w-[110px]"
            aria-label="MHANAC Home"
          >
            <div className="relative w-8 h-8 rounded-md bg-white/10 overflow-hidden">
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

          {/* Lang small (optionnel, comme screenshot “En”) */}
          <div className="hidden sm:flex items-center gap-1 text-white/80 text-sm">
            <span className="uppercase">{lang}</span>
            <span className="opacity-60">▾</span>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2">
            <input
              placeholder="Search"
              className="h-9 w-full max-w-[420px] rounded-sm px-3 text-sm text-black outline-none bg-white"
            />
            <button
              className="h-9 px-4 rounded-sm bg-white text-black text-sm font-semibold"
              type="button"
            >
              Submit
            </button>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goRegion("us")}
              className={[
                "rounded-sm p-1 border transition",
                region === "us"
                  ? "border-green-400 bg-white"
                  : "border-white/20 bg-white/10 hover:bg-white/15",
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
                region === "haiti"
                  ? "border-green-400 bg-white"
                  : "border-white/20 bg-white/10 hover:bg-white/15",
              ].join(" ")}
              aria-label="Haiti"
              title="Haiti"
            >
              <Image src="/images/haiti.png" alt="Haiti" width={28} height={18} />
            </button>
          </div>

          {/* Cart */}
          <button
            type="button"
            className="relative ml-1 p-2 rounded-sm bg-white/10 hover:bg-white/15 transition"
            aria-label="Cart"
            title="Cart"
          >
            <CartIcon className="w-5 h-5 text-white" />
            <span className="absolute -top-2 -right-2 bg-green-400 text-black text-[11px] w-5 h-5 rounded-full grid place-items-center font-bold">
              0
            </span>
          </button>

          {/* Login (comme screenshot à droite) */}
          <button
            type="button"
            className="ml-1 px-3 py-2 rounded-sm bg-transparent hover:bg-white/10 transition text-sm font-semibold"
          >
            Login <span className="opacity-70">▾</span>
          </button>
        </div>
      </div>

      {/* ===== CATEGORY LINE (style screenshot) ===== */}
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
                    "bg-transparent",
                    active ? "text-slate-900 font-semibold" : "text-slate-500",
                    "hover:text-green-600",
                  ].join(" ")}
                >
                  {/* zoom effect */}
                  <span className="inline-flex items-center gap-2 transform transition-transform duration-200 group-hover:scale-110">
                    <span className="text-base">{c.icon ?? "•"}</span>
                    <span className="text-sm capitalize">
                      {label(c.key)}
                    </span>
                  </span>

                  {/* underline glow */}
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

        {/* grey line like screenshot */}
        <div className="h-[4px] bg-black/50" />
      </div>
    </header>
  );
}
