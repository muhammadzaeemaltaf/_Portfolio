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
    title: "Muhammad Zaeem Altaf – Full-Stack Web Developer | Next.js, React, Tailwind",
    description:
      "Hi, I’m Zaeem – a full-stack developer specializing in Next.js, React, and Tailwind CSS. I build fast, scalable, user-friendly web apps.",
    icons: {
      icon: "/favicon.ico",
    },
    verification: {
      google: "9Jm-lCyk2ZAGml9QWXLCkgwkzrb78gbR7Pbw4g5BTEw",
    },
    alternates: {
      canonical: "https://zaeemaltaf.tech",
    },
    openGraph: {
      title: "Muhammad Zaeem Altaf – Full-Stack Web Developer",
      description:
        "Crafting blazing-fast, scalable apps with Next.js, React, and Tailwind CSS.",
      url: "https://zaeemaltaf.tech",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Muhammad Zaeem Altaf – Full-Stack Web Developer",
      description: "Building modern web apps with Next.js, React, and Tailwind CSS.",
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
      <head>
        {/* Schema.org Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Zaeem Altaf",
              url: "https://zaeemaltaf.tech",
              jobTitle: "Full-Stack Web Developer",
              sameAs: [
                "https://github.com/muhammadzaeemaltaf",
                "https://pk.linkedin.com/in/muhammadzaeemaltaf",
              ],
              knowsAbout: ["Next.js", "React", "Tailwind CSS", "JavaScript", "TypeScript", "Laravel"]
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
