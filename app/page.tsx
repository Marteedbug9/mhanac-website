"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegion } from "./providers/RegionProvider"; // ✅ Solution 3

type Region = "us" | "haiti";

/**
 * ✅ TUNING (change these 2 values to resize BOTH flags equally)
 * - FLAG_BOX_H: height of the flag image box (same for USA + Haiti)
 * - FLAG_PADDING: padding inside the flag image box
 */
const FLAG_BOX_H = "h-[80px] md:h-[60px]";
const FLAG_PADDING = "p-3";

export default function RegionGate() {
  const router = useRouter();

  // ✅ from Solution 3 (global state + persistence)
  const { setRegionAndLang } = useRegion();

  const phrases = useMemo(
    () => [
      { lang: "EN", text: "What is your region?" },
      { lang: "FR", text: "Quelle est votre région ?" },
      { lang: "HT", text: "Ki rejyon ou ye ?" },
      { lang: "ES", text: "¿Cuál es tu región?" },
    ],
    []
  );

  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<Region | null>(null);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % phrases.length), 1800);
    return () => clearInterval(t);
  }, [phrases.length]);

  function choose(region: Region) {
    setSelected(region);

    // ✅ Solution 3:
    // This will set region + default language AND persist (cookies/localStorage handled in provider)
    setRegionAndLang(region);

    // ✅ Redirect to Products
    const defaultLang = region === "us" ? "en" : "ht";
    router.push(`/${defaultLang}/products`);
  }

  const borderClass = (r: Region) =>
    selected === r ? "border-green-500" : "border-blue-500 hover:border-blue-400";

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-16 text-white">
      {/* ✅ Background front.png (responsive all screens) */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/front.png"
          alt="Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Background big text */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 grid place-items-center opacity-[0.10] pointer-events-none select-none text-center px-6"
      >
        <div className="text-[42px] md:text-[64px] font-black tracking-wide leading-tight">
          {phrases[i].text}
        </div>
        <div className="mt-3 text-xs md:text-sm tracking-[0.5em]">
          {phrases[i].lang}
        </div>
      </div>

      {/* Foreground card */}
      <div className="w-full max-w-5xl rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <div className="flex justify-between gap-3 flex-wrap">
          <div className="font-black tracking-wide">MHANAC</div>
          <div className="text-xs opacity-90">EN • FR • KREYÒL • ES</div>
        </div>

        <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight">
          {phrases[i].text}
        </h1>
        <p className="mt-2 text-white/85">
          Select your country to continue. The language + region settings will be applied,
          then you will go to Products.
        </p>

        {/* ✅ Flag images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
          {/* USA */}
          <button
            type="button"
            onClick={() => choose("us")}
            className={`group rounded-2xl border-2 ${borderClass(
              "us"
            )} bg-white/80 text-slate-900 overflow-hidden transition shadow-[0_12px_35px_rgba(2,6,23,0.20)]`}
            aria-label="Choose USA"
          >
            {/* ✅ SAME size box + SAME padding for both flags */}
            <div className={`relative ${FLAG_BOX_H}`}>
              <Image
                src="/images/usa.png"
                alt="USA"
                fill
                className={`object-contain ${FLAG_PADDING} transition-transform duration-300 group-hover:scale-[1.07]`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="px-6 pb-6 text-left">
              <div className="font-bold text-lg">United States</div>
              <div className="text-sm text-slate-600 mt-1">
                Default language: English
              </div>
              <div className="mt-3 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
                Continue to Products →
              </div>
            </div>
          </button>

          {/* Haiti */}
          <button
            type="button"
            onClick={() => choose("haiti")}
            className={`group rounded-2xl border-2 ${borderClass(
              "haiti"
            )} bg-white/80 text-slate-900 overflow-hidden transition shadow-[0_12px_35px_rgba(2,6,23,0.20)]`}
            aria-label="Choose Haiti"
          >
            {/* ✅ SAME size box + SAME padding for both flags */}
            <div className={`relative ${FLAG_BOX_H}`}>
              <Image
                src="/images/haiti.png"
                alt="Haiti"
                fill
                className={`object-contain ${FLAG_PADDING} transition-transform duration-300 group-hover:scale-[1.07]`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="px-6 pb-6 text-left">
              <div className="font-bold text-lg">Haïti</div>
              <div className="text-sm text-slate-600 mt-1">
                Lang default: Kreyòl Ayisyen
              </div>
              <div className="mt-3 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
                Kontinye nan Pwodwi yo →
              </div>
            </div>
          </button>
        </div>

        <p className="mt-6 text-xs text-white/80">
          Tip: Hover to zoom • Border becomes green when selected • You can login later to buy.
        </p>
      </div>
    </main>
  );
}
