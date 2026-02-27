"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Region = "us" | "haiti";
const STORAGE_KEY = "MHANAC_REGION";

/* FLAGS */
const FLAG_BOX_H = "h-[160px] sm:h-[190px] md:h-[220px]";
const FLAG_PADDING = "p-4 sm:p-6";

const categories = [
  {
    img: "/images/listproduc/electro.png",
    size: "w-[352px] h-[352px] sm:w-[268px] sm:h-[268px] md:w-[290px] md:h-[290px]",
    pos: "left-[-48%] bottom-[-16px] sm:bottom-[-30px] md:bottom-[-205px]",
  },
  {
    img: "/images/listproduc/beauty.png",
    size: "w-[472px] h-[472px] sm:w-[388px] sm:h-[388px] md:w-[410px] md:h-[410px]",
    pos: "top-[-10px] sm:top-[-28px] md:top-[285px] right-[84%]",
  },
  {
    img: "/images/listproduc/fashion.png",
    size: "w-[472px] h-[472px] sm:w-[288px] sm:h-[288px] md:w-[310px] md:h-[310px]",
    pos: "right-[-5px] sm:right-[-5px] md:right-[122px] top-[55px] md:top-[370px]",
  },
  {
    img: "/images/listproduc/home.png",
    size: "w-[572px] h-[572px] sm:w-[488px] sm:h-[488px] md:w-[410px] md:h-[410px]",
    pos: "right-[-20px] sm:right-[-25px] md:right-[-380px] bottom-[-205px] md:bottom-[-200px]",
  },
  {
    img: "/images/listproduc/groce1.png",
    size: "w-[352px] h-[352px] sm:w-[288px] sm:h-[288px] md:w-[330px] md:h-[330px]",
    pos: "top-[-10px] sm:top-[-28px] md:top-[325px] right-[44%]",
  },
  {
    img: "/images/mhanac logo1.png",
    size: "w-[372px] h-[372px] sm:w-[188px] sm:h-[188px] md:w-[270px] md:h-[270px]",
    pos: "left-[-15px] sm:left-[-35px] md:left-[-30px] top-[55px] md:top-[-200px]",
  },
] as const;

export default function RegionGate() {
  const router = useRouter();
  const [i, setI] = useState(0);

  const phrases = useMemo(
    () => [
      { text: "What is your region?" },
      { text: "Quelle est votre région ?" },
      { text: "Ki rejyon ou ye ?" },
      { text: "¿Cuál es tu región?" },
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => setI((p) => (p + 1) % phrases.length), 2500);
    return () => clearInterval(timer);
  }, [phrases.length]);

  const selectRegion = (r: Region) => {
    localStorage.setItem(STORAGE_KEY, r);
    const lang = r === "us" ? "en" : "ht";
    router.push(`/${lang}/products?region=${r}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#E4FCE3] overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Background Images */}
      <div className="absolute inset-0 pointer-events-none">
        {categories.map((c, idx) => (
          <div key={idx} className={`absolute ${c.pos} ${c.size} opacity-20`}>
            <Image src={c.img} alt="" fill className="object-contain" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6 text-center">
        <div className="mb-4 flex justify-center">
          <Image src="/images/mhanac logo1.png" alt="Logo" width={120} height={120} className="object-contain" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 transition-opacity duration-500">
          {phrases[i].text}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* USA */}
          <button
            onClick={() => selectRegion("us")}
            className={`group relative ${FLAG_BOX_H} rounded-3xl bg-white border-2 border-transparent hover:border-blue-500 transition-all shadow-xl overflow-hidden`}
          >
            <div className={`absolute inset-0 ${FLAG_PADDING} flex flex-col items-center justify-center`}>
               <div className="relative w-full h-full mb-2">
                 <Image src="/images/usa.png" alt="USA" fill className="object-contain group-hover:scale-105 transition" />
               </div>
               <span className="font-bold text-slate-800">UNITED STATES</span>
            </div>
          </button>

          {/* HAITI */}
          <button
            onClick={() => selectRegion("haiti")}
            className={`group relative ${FLAG_BOX_H} rounded-3xl bg-white border-2 border-transparent hover:border-red-500 transition-all shadow-xl overflow-hidden`}
          >
            <div className={`absolute inset-0 ${FLAG_PADDING} flex flex-col items-center justify-center`}>
               <div className="relative w-full h-full mb-2">
                 <Image src="/images/haiti.png" alt="Haiti" fill className="object-contain group-hover:scale-105 transition" />
               </div>
               <span className="font-bold text-slate-800">HAÏTI</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}