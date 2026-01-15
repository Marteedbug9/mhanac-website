"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Region = "us" | "haiti";

const FLAG_BOX_H = "h-[160px] sm:h-[190px] md:h-[220px]";
const FLAG_PADDING = "p-4 sm:p-6";

/**
 * ✅ Tip:
 * - Si ou vle yo rete FIX sou ekran an: sèvi ak `fixed bottom-0`
 * - Si ou vle yo tache sou kat la: sèvi ak `absolute` anndan wrapper la
 */
const floating = [
  {
    img: "/images/listproduc/electro.png",
    size: "w-[170px] h-[170px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px]",
    pos: "left-6 bottom-2",
  },
  {
    img: "/images/listproduc/beauty.png",
    size: "w-[180px] h-[180px] sm:w-[230px] sm:h-[230px] md:w-[280px] md:h-[280px]",
    pos: "left-[140px] bottom-2 sm:left-[210px]",
  },
  {
    img: "/images/listproduc/groce1.png",
    size: "w-[210px] h-[210px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px]",
    pos: "left-1/2 -translate-x-1/2 bottom-1",
  },
  {
    img: "/images/listproduc/fashion.png",
    size: "w-[210px] h-[210px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]",
    pos: "right-[160px] bottom-2 sm:right-[220px]",
  },
  {
    img: "/images/listproduc/home.png",
    size: "w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px]",
    pos: "right-6 bottom-0",
  },
] as const;

export default function RegionGate() {
  const router = useRouter();

  const phrases = useMemo(
    () => [
      { text: "What is your region?" },
      { text: "Quelle est votre région ?" },
      { text: "Ki rejyon ou ye ?" },
      { text: "¿Cuál es tu región?" },
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
    localStorage.setItem("MHANAC_REGION", region);
    const defaultLang = region === "us" ? "en" : "ht";
    router.push(`/${defaultLang}/products?region=${region}`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 text-white">
      {/* ✅ Background */}
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

      {/* ✅ Floating images FIXED at the bottom (BEHIND card) */}
      <div aria-hidden className="fixed inset-x-0 bottom-0 z-0 pointer-events-none">
        {floating.map((c, idx) => (
          <div
            key={idx}
            className={["absolute", c.pos, c.size, "relative"].join(" ")}
          >
            <Image
              src={c.img}
              alt="decor"
              fill
              className="object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
              sizes="300px"
              priority={idx < 2}
            />
          </div>
        ))}
      </div>

      {/* ✅ Foreground card (ABOVE images) */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 sm:p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="font-black tracking-wide">MHANAC</div>

          <h1 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight">
            {phrases[i].text}
          </h1>

          <p className="mt-2 text-white/85 text-sm sm:text-base">
            Select your country to continue.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
            <button
              type="button"
              onClick={() => choose("us")}
              aria-label="Choose USA"
              className={["relative group transition", FLAG_BOX_H].join(" ")}
            >
              <Image
                src="/images/usa.png"
                alt="USA"
                fill
                priority
                className={[
                  "object-contain",
                  FLAG_PADDING,
                  "transition-transform duration-300 group-hover:scale-[1.08]",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>

            <button
              type="button"
              onClick={() => choose("haiti")}
              aria-label="Choose Haiti"
              className={["relative group transition", FLAG_BOX_H].join(" ")}
            >
              <Image
                src="/images/haiti.png"
                alt="Haiti"
                fill
                priority
                className={[
                  "object-contain",
                  FLAG_PADDING,
                  "transition-transform duration-300 group-hover:scale-[1.08]",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
