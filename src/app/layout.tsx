import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Muhammad Zaeem Altaf | Full-Stack Web Developer | Next.js Developer",
    description:
      "Full stack developer skilled in Next.js & Tailwind CSS, crafting responsive, user-focused websites with top performance.",
    icons: {
      icon: "/favicon.ico",
    },
    verification: {
      google: "9Jm-lCyk2ZAGml9QWXLCkgwkzrb78gbR7Pbw4g5BTEw",
    },
    openGraph: {
      title: "Muhammad Zaeem Altaf | Full-Stack Web Developer",
      url: "https://zaeemaltaf.tech",
    },
    other: {
      canonical: "https://zaeemaltaf.tech",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
