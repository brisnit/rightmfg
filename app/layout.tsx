import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FinderDialog } from "@/components/finder/FinderDialog";
import { company } from "@/data/company";
import { markets } from "@/data/markets";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE = "https://www.rightmfg.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Right Manufacturing | Precision Metal Fabrication & Forming, San Diego",
    template: "%s | Right Manufacturing",
  },
  description:
    "Tube bending, 3D bending, sheet metal, MIG/TIG/spot welding, hardware and assembly for OEMs, prototype through production. 20,000 sq. ft. in San Diego, California.",
  openGraph: {
    type: "website",
    siteName: "Right Manufacturing",
    images: [{ url: "/images/hero-poster.jpg", width: 1920, height: 1080 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#07183e",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: company.name,
  legalName: company.legalName,
  url: SITE,
  email: company.email,
  telephone: "+1-858-566-7002",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 35 },
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.region,
    postalCode: company.address.postal,
    addressCountry: "US",
  },
  areaServed: ["San Diego", "Southern California", "United States"],
  knowsAbout: [
    "Tube bending",
    "Mandrel tube bending",
    "3D bending",
    "Sheet metal fabrication",
    "CNC turret punching",
    "CNC press brake forming",
    "MIG welding",
    "TIG welding",
    "Spot welding",
    "Hardware installation",
    "Assembly",
    "CNC machining",
    "Powder coating",
  ],
  audience: markets.map((m) => ({ "@type": "BusinessAudience", audienceType: m.name })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col overflow-x-clip">
        <a
          href="#main"
          className="label sr-only z-[100] bg-blue px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <FinderDialog />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
