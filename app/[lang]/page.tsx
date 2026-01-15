import Link from "next/link";
import { t, type Lang } from "./lib/i18n";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = (["en", "fr", "ht", "es"].includes(raw) ? raw : "en") as Lang;
  const c = t[lang];

  return (
    <main className="wrap hero">
      <div className="grid">
        <div>
          <div className="pill">{c.pill}</div>
          <h1>{c.home.title}</h1>
          <p className="sub">{c.home.sub}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
            <Link className="btn primary" href={`/${lang}/wholesale#quote`}>{c.home.cta1}</Link>
            <Link className="btn" href={`/${lang}/products`}>{c.home.cta2}</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 18 }}>
            <div className="card"><b>Wholesale</b><div className="small">Case & pallet pricing</div></div>
            <div className="card"><b>Online</b><div className="small">Fast shipping options</div></div>
            <div className="card"><b>Support</b><div className="small">Custom quotes & sourcing</div></div>
          </div>
        </div>

        <div className="heroCard">
          <h3 style={{ margin: "0 0 10px" }}>{c.home.formTitle}</h3>
          <p className="small" style={{ margin: "0 0 12px" }}>{c.home.formSub}</p>
          <form>
            <input placeholder={c.home.phBusiness} />
            <div style={{ height: 10 }} />
            <input placeholder={c.home.phEmail} />
            <div style={{ height: 10 }} />
            <input placeholder={c.home.phProducts} />
            <div style={{ height: 10 }} />
            <textarea placeholder={c.home.phDetails} />
            <div style={{ height: 12 }} />
            <button type="button" className="btn primary" style={{ width: "100%", justifyContent: "center" }}>
              {c.home.send}
            </button>
            <p className="small" style={{ margin: "10px 0 0" }}>{c.home.note}</p>
          </form>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 28 }}>
        <div className="card">
          <div style={{ fontSize: 22 }}>🍼</div>
          <h3 style={{ margin: "10px 0 6px" }}>{c.products.cat1}</h3>
          <p className="small" style={{ margin: 0 }}>{c.products.cat1d}</p>
        </div>
        <div className="card">
          <div style={{ fontSize: 22 }}>🏠</div>
          <h3 style={{ margin: "10px 0 6px" }}>{c.products.cat2}</h3>
          <p className="small" style={{ margin: 0 }}>{c.products.cat2d}</p>
        </div>
        <div className="card">
          <div style={{ fontSize: 22 }}>🥤</div>
          <h3 style={{ margin: "10px 0 6px" }}>{c.products.cat3}</h3>
          <p className="small" style={{ margin: 0 }}>{c.products.cat3d}</p>
        </div>
      </div>
    </main>
  );
}
