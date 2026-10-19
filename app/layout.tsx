import type { Metadata } from "next";
import "./globals.css";

const vercelProductionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  vercelProductionDomain
    ? `https://${vercelProductionDomain}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ramakrishna T — Full Stack Developer",
  description: "Portfolio of Ramakrishna T, a full-stack developer working with Java, Spring Boot, React, TypeScript, and AWS.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Ramakrishna T — Full Stack Developer",
    description: "Java, Spring Boot, React, TypeScript, and AWS.",
    url: siteUrl,
    siteName: "Ramakrishna T Portfolio",
    type: "website",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#eee8d8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
