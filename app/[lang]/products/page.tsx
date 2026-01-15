import { t, type Lang } from "../lib/i18n";

export default async function Products({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = (["en", "fr", "ht", "es"].includes(raw) ? raw : "en") as Lang;
  const c = t[lang];

  return (
    <main className="wrap hero">
      <div className="pill">{c.pill}</div>
      <h1>{c.products.title}</h1>
      <p className="sub">{c.products.sub}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 22 }}>
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
