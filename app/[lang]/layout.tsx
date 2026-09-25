import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Noto_Sans_SC } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FinderDialog } from "@/components/finder/FinderDialog";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { SITE_URL, alternatesFor, isLocale, localeMeta, locales } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
// Script fonts: Archivo/Plex Mono have no Arabic or CJK glyphs; these fill in per-glyph and only download when used.
const arabic = IBM_Plex_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic"], weight: ["400", "500", "600", "700"], display: "swap", preload: false });
const chinese = Noto_Sans_SC({ variable: "--font-sc", subsets: ["latin"], weight: ["400", "500", "700", "900"], display: "swap", preload: false });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.siteTitle, template: dict.meta.titleTemplate },
    description: dict.meta.siteDescription,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      type: "website",
      siteName: "Right Manufacturing",
      locale: localeMeta[locale].ogLocale,
      images: [{ url: "/images/hero-poster.jpg", width: 1920, height: 1080 }],
    },
  };
}

export const viewport: Viewport = { themeColor: "#07183e" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { locale, dict, content } = await getI18n();
  const meta = localeMeta[locale];
  const c = content.company;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: c.name,
    legalName: c.legalName,
    url: SITE_URL,
    email: c.email,
    telephone: "+1-858-566-7002",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 35 },
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address.street,
      addressLocality: c.address.city,
      addressRegion: c.address.region,
      postalCode: c.address.postal,
      addressCountry: "US",
    },
    areaServed: ["San Diego", "Southern California", "United States"],
    knowsAbout: content.capabilities.map((x) => x.name),
    audience: content.markets.map((m) => ({ "@type": "BusinessAudience", audienceType: m.name })),
  };

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={`${archivo.variable} ${plexMono.variable} ${arabic.variable} ${chinese.variable} antialiased`}>
      <body className="flex min-h-screen flex-col overflow-x-clip">
        <I18nProvider value={{ locale, dict, content }}>
          <a href="#main" className="label sr-only z-[100] bg-blue px-4 py-3 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
            {dict.common.skipToContent}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <FinderDialog />
        </I18nProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
