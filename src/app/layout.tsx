import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "rewindcup",
  description: "Watch classic football tournament moments unfold again."
};

const mapTileOrigin = "https://tiles.openfreemap.org";

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
      <body>{children}</body>
    </html>
  );
}
