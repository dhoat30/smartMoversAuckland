//import css file
import "./globals.scss";
import "./tokens.css";
// Import slick css files
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { Barlow, Inter } from "next/font/google";
// import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter"
import ClientProvider from "@/Providers/ClientProvider";
import Script from "next/script";
import JsonLd from "@/Components/SEO/JsonLd";
import { buildRootSchema } from "@/utils/schema";

// fonts settings

const fonts = Barlow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: true,
});
const workSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export const metadata = {
  metadataBase: new URL(process.env.siteUrl),
  title: {
    default: "Smart Movers — Trusted House, Office & Furniture Movers",
  },
  description:
    "Smart Movers provides reliable local and nationwide house, office and furniture removals across New Zealand. WINZ approved, fully insured — get a fast free quote.",
  applicationName: process.env.siteName,
  openGraph: {
    siteName: process.env.siteName,
    locale: "en_NZ",
    type: "website",
    url: process.env.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export default function RootLayout({ children }) {
  const GTM_ID = "GTM-P7XCJ3DP";

  return (
    <html lang="en">
      <Script
        id="gtm-script"
        strategy="lazyOnload" // or "lazyOnload" if you prefer
        dangerouslySetInnerHTML={{
          __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s);j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
        }}
      />
      <body className={`${fonts.variable} ${workSans.variable}`}>
        <JsonLd
          data={buildRootSchema({
            siteUrl: process.env.siteUrl,
            siteName: process.env.siteName,
          })}
        />
        {/* 3) GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            loading="lazy"
          />
        </noscript>
        {/* <AppRouterCacheProvider> */}
        <ClientProvider>{children}</ClientProvider>
        {/* </AppRouterCacheProvider> */}
        {/* Load ONCE after hydration */}
      </body>
    </html>
  );
}
