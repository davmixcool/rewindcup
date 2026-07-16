export const siteName = "Rewind Cup";
export const siteTitle = "Rewind Cup — Relive Every World Cup";
export const siteDescription =
  "Explore 23 World Cups from 1930 to 2026 through an interactive globe, fixtures, stadium journeys, match events and playable highlights.";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://rewindcup.com");

export const socialImages = [
  {
    url: "/images/rewindcup-social-card.jpg",
    width: 1200,
    height: 630,
    alt: "A luminous interactive globe framed by legendary World Cup footballers"
  }
];
