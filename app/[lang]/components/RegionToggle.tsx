"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Region = "us" | "haiti";

export default function RegionToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const regionFromUrl = (sp.get("region") as Region) || null;
  const [region, setRegion] = useState<Region>("us");

  useEffect(() => {
    const saved = (localStorage.getItem("MHANAC_REGION") as Region) || null;
    const initial = regionFromUrl ?? saved ?? "us";
    setRegion(initial);
  }, [regionFromUrl]);

  const go = (r: Region) => {
    setRegion(r);
    localStorage.setItem("MHANAC_REGION", r);

    const url = new URL(window.location.href);
    url.searchParams.set("region", r);
    router.push(`${pathname}?${url.searchParams.toString()}`);
  };

  const active = useMemo(() => region, [region]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        onClick={() => go("us")}
        style={{
          borderRadius: 12,
          padding: 6,
          border: active === "us" ? "2px solid rgba(89,211,155,.65)" : "1px solid rgba(255,255,255,.18)",
          background: active === "us" ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.06)",
        }}
        aria-label="USA"
      >
        <Image src="/images/usa.png" alt="USA" width={32} height={20} style={{ borderRadius: 6 }} />
      </button>

      <button
        onClick={() => go("haiti")}
        style={{
          borderRadius: 12,
          padding: 6,
          border: active === "haiti" ? "2px solid rgba(89,211,155,.65)" : "1px solid rgba(255,255,255,.18)",
          background: active === "haiti" ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.06)",
        }}
        aria-label="Haiti"
      >
        <Image src="/images/haiti.png" alt="Haiti" width={32} height={20} style={{ borderRadius: 6 }} />
      </button>
    </div>
  );
}
