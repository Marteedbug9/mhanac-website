import Link from "next/link";
import type { ReactNode } from "react";
import { LANGS, type Lang } from "./lib/i18n";

function getBaseStyles() {
  return `
  :root{
    --bg:#0b1220; --text:#eaf0ff; --muted:#b7c2e5; --stroke:rgba(255,255,255,.10);
    --brand:#59d39b; --brand2:#7aa7ff; --r:18px; --shadow:0 20px 60px rgba(0,0,0,.45);
  }
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;background:
    radial-gradient(1200px 600px at 20% -10%, rgba(89,211,155,.25), transparent 55%),
    radial-gradient(900px 500px at 80% 0%, rgba(122,167,255,.25), transparent 55%),
    linear-gradient(180deg,#050914,var(--bg));color:var(--text)}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1150px;margin:0 auto;padding:0 18px}
  .nav{position:sticky;top:0;z-index:10;background:rgba(5,9,20,.65);backdrop-filter:blur(10px);
    border-bottom:1px solid var(--stroke)}
  .navin{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:12px;flex-wrap:wrap}
  .logo{display:flex;gap:10px;align-items:center;font-weight:800;letter-spacing:.6px}
  .badge{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--brand),var(--brand2))}
  .links{display:flex;gap:14px;align-items:center;color:var(--muted);font-weight:600;flex-wrap:wrap}
  .btn{display:inline-flex;align-items:center;gap:10px;border:1px solid var(--stroke);
    background:rgba(255,255,255,.06);padding:10px 14px;border-radius:999px;font-weight:700}
  .btn.primary{background:linear-gradient(135deg,var(--brand),var(--brand2));border:none;color:#061022}
  .hero{padding:54px 0 26px}
  .grid{display:grid;gap:22px;grid-template-columns:1.35fr .65fr}
  @media (max-width:900px){.grid{grid-template-columns:1fr}}
  h1{font-size:48px;line-height:1.05;margin:0 0 14px}
  .sub{color:var(--muted);font-size:18px;line-height:1.5;max-width:58ch}
  .card{border:1px solid var(--stroke);border-radius:var(--r);padding:18px;background:rgba(15,26,51,.35)}
  .heroCard{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.04));
    border:1px solid var(--stroke);border-radius:var(--r);padding:18px;box-shadow:var(--shadow)}
  .pill{display:inline-flex;gap:10px;align-items:center;padding:8px 12px;border-radius:999px;
    background:rgba(89,211,155,.12);border:1px solid rgba(89,211,155,.30);color:#c9ffe9;font-weight:700}
  .footer{padding:26px 0;color:var(--muted);border-top:1px solid var(--stroke)}
  .small{font-size:12px;color:var(--muted)}
  input,textarea{width:100%;padding:12px 12px;border-radius:14px;border:1px solid var(--stroke);
    background:rgba(255,255,255,.06);color:var(--text);outline:none}
  textarea{min-height:120px;resize:vertical}
  `;
}

const navCopy: Record<Lang, { home: string; products: string; wholesale: string; contact: string; quote: string; lang: string }> = {
  en: { home: "Home", products: "Products", wholesale: "Wholesale", contact: "Contact", quote: "Request a Quote", lang: "Language" },
  fr: { home: "Accueil", products: "Produits", wholesale: "Grossiste", contact: "Contact", quote: "Demander un devis", lang: "Langue" },
  ht: { home: "Akèy", products: "Pwodwi", wholesale: "Gwo vann", contact: "Kontak", quote: "Mande devi", lang: "Lang" },
  es: { home: "Inicio", products: "Productos", wholesale: "Mayorista", contact: "Contacto", quote: "Solicitar cotización", lang: "Idioma" },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = ((LANGS as readonly string[]).includes(raw) ? raw : "en") as Lang;
  const n = navCopy[lang];

  return (
    <html lang={lang}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: getBaseStyles() }} />
      </head>
      <body>
        <div className="nav">
          <div className="wrap navin">
            <div className="logo">
              <div className="badge" />
              <div>MHANAC</div>
            </div>

            <div className="links">
              <Link href={`/${lang}`}>{n.home}</Link>
              <Link href={`/${lang}/products`}>{n.products}</Link>
              <Link href={`/${lang}/wholesale`}>{n.wholesale}</Link>
              <Link href={`/${lang}/contact`} className="btn">{n.contact}</Link>
              <Link href={`/${lang}/wholesale#quote`} className="btn primary">{n.quote}</Link>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="small">{n.lang}</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {LANGS.map((l) => (
                    <Link
                      key={l}
                      href={`/${l}`}
                      className="btn"
                      style={{
                        padding: "8px 10px",
                        opacity: l === lang ? 1 : 0.7,
                        borderColor: l === lang ? "rgba(89,211,155,.45)" : undefined,
                      }}
                    >
                      {l.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {children}

        <div className="footer">
          <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div>© {new Date().getFullYear()} MHANAC LLC. All rights reserved.</div>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
