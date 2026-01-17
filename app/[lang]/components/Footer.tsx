"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import type { Lang } from "../lib/i18n";

const BLUE = "#0b4fb3";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ht", label: "Kreyòl Ayisyen" },
  { code: "es", label: "Español" },
];

const SHOP: { key: string; label: string }[] = [
  { key: "electronics", label: "Electronics" },
  { key: "home_kitchen", label: "Home & Kitchen" },
  { key: "beauty", label: "Beauty" },
  { key: "fashion", label: "Fashion" },
  { key: "grocery", label: "Grocery" },
  { key: "health", label: "Health" },
  { key: "baby_kids", label: "Baby & Kids" },
  { key: "toys_games", label: "Toys & Games" },
  { key: "sports_outdoors", label: "Sports & Outdoors" },
  { key: "automotive", label: "Automotive" },
  { key: "tools_home_improvement", label: "Tools & Home Improvement" },
  { key: "office_school", label: "Office & School" },
  { key: "pet_supplies", label: "Pet Supplies" },
  { key: "services", label: "Services" },
  { key: "wholesale_bulk", label: "Wholesale & Bulk" },
];

function stripLangPrefix(pathname: string) {
  // remove leading /en /fr /ht /es
  return pathname.replace(/^\/(en|fr|ht|es)(\/|$)/, "/");
}

export default function Footer({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  const restPath = useMemo(() => stripLangPrefix(pathname), [pathname]);
  const currentQuery = useMemo(() => sp.toString(), [sp]);

  function switchLang(next: Lang) {
    const qs = currentQuery ? `?${currentQuery}` : "";
    router.push(`/${next}${restPath}${qs}`);
  }

  return (
    <footer className="w-full bg-white border-t border-black/10 mt-10">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Logo + short */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl border border-black/10 overflow-hidden bg-white">
                <Image
                  src="/images/mhanac logo.png"
                  alt="MHANAC"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              <div>
                <div
                  className="text-lg font-black"
                  style={{ color: BLUE }}
                >
                  MHANAC
                </div>
                <div className="text-sm text-black/60">
                  Wholesale • C-Store • Online
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-black/70 max-w-md">
              Shop smarter with MHANAC — categories, wholesale & bulk deals, and more.
            </div>
          </div>

          {/* Languages */}
          <div className="lg:col-span-3">
            <div className="text-sm font-black mb-3" style={{ color: BLUE }}>
              Language
            </div>

            <div className="flex flex-wrap gap-2">
              {LANGS.map((l) => {
                const active = l.code === lang;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => switchLang(l.code)}
                    className={[
                      "px-3 py-2 rounded-xl text-sm border transition",
                      active
                        ? "bg-[#0b4fb3] text-white border-[#0b4fb3]"
                        : "bg-white text-[#0b4fb3] border-[#0b4fb3]/25 hover:border-[#0b4fb3]",
                    ].join(" ")}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shop links */}
          <div className="lg:col-span-5">
            <div className="text-sm font-black mb-3" style={{ color: BLUE }}>
              Shop
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SHOP.map((s) => (
                <Link
                  key={s.key}
                  href={`/${lang}/products?category=${encodeURIComponent(s.key)}`}
                  className="rounded-xl border border-[#0b4fb3]/15 px-3 py-2 text-sm hover:border-[#0b4fb3] transition"
                  style={{ color: BLUE }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm" style={{ color: BLUE }}>
            © 2026 MHANAC
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link href={`/${lang}/products`} style={{ color: BLUE }} className="hover:underline">
              Products
            </Link>
            <Link href={`/${lang}/products?category=wholesale_bulk`} style={{ color: BLUE }} className="hover:underline">
              Wholesale
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
