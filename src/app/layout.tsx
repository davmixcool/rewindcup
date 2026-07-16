import type { Metadata } from "next";
import Script from "next/script";
import { siteDescription, siteName, siteTitle, siteUrl, socialImages } from "@/lib/siteMetadata";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "David Oti", url: "https://x.com/iamdavidoti" }],
  creator: "David Oti",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: socialImages
  },
  twitter: {
    card: "summary_large_image",
    creator: "@iamdavidoti",
    title: siteTitle,
    description: siteDescription,
    images: socialImages
  }
};

const mapTileOrigin = "https://tiles.openfreemap.org";
const cloudflareWebAnalyticsToken = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link crossOrigin="anonymous" href={mapTileOrigin} rel="preconnect" />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "production" && cloudflareWebAnalyticsToken ? (
          <Script
            data-cf-beacon={JSON.stringify({ token: cloudflareWebAnalyticsToken })}
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
