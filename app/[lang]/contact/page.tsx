import { t, type Lang } from "../lib/i18n";

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = (["en", "fr", "ht", "es"].includes(raw) ? raw : "en") as Lang;
  const c = t[lang];

  return (
    <main className="wrap hero">
      <div className="pill">{c.pill}</div>
      <h1>{c.contact.title}</h1>
      <p className="sub">{c.contact.sub}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
        <div className="card">
          <b>MHANAC LLC</b>
          <div className="small" style={{ marginTop: 10 }}>
            Columbus, OH • support@mhanac.com
          </div>
          <div className="small" style={{ marginTop: 10 }}>
            Wholesale • Online • Private Label (Diapers & Wipes)
          </div>
        </div>

        <div className="heroCard">
          <h3 style={{ margin: "0 0 10px" }}>{c.contact.title}</h3>
          <form>
            <input placeholder={c.contact.phName} />
            <div style={{ height: 10 }} />
            <input placeholder={c.contact.phEmail} />
            <div style={{ height: 10 }} />
            <textarea placeholder={c.contact.phMsg} />
            <div style={{ height: 12 }} />
            <button type="button" className="btn primary" style={{ width: "100%", justifyContent: "center" }}>
              {c.contact.send}
            </button>
            <p className="small" style={{ margin: "10px 0 0" }}>{c.contact.note}</p>
          </form>
        </div>
      </div>
    </main>
  );
}
