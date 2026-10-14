import type { Metadata } from "next";
import "./globals.css";

const vercelProductionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionDomain
    ? `https://${vercelProductionDomain}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ramakrishna T — Full Stack Developer",
  description:
    "Ramakrishna T is a senior full-stack developer building reliable Java, Spring, React, AWS, healthcare, fintech, and banking systems.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Ramakrishna T — Full Stack Developer",
    description: "Eight years of engineering secure, scalable enterprise systems.",
    url: siteUrl,
    siteName: "Ramakrishna T Portfolio",
    images: [{ url: "/assets/systems-architecture-v2.webp", width: 3840, height: 1645 }],
    type: "website",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#080b0c" />
      </head>
      <body>{children}</body>
    </html>
  );
}
