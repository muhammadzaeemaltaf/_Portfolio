import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    title:
      "Muhammad Zaeem Altaf – Full-Stack Web Developer | Next.js, React, Tailwind",
    description:
      "Hi, I’m Zaeem – a full-stack developer specializing in Next.js, React, and Tailwind CSS. I build fast, scalable, user-friendly web apps.",
    icons: {
      icon: "/favicon.ico",
    },
    verification: {
      google: "PdJjT4pzoRVp0RIH5aPM9sA5Eo9u4jC-8d8BxZwL-xc",
    },
    alternates: {
      canonical: "https://muhammadzaeemaltaf.vercel.app/",
    },
    openGraph: {
      title: "Muhammad Zaeem Altaf – Full-Stack Web Developer",
      description:
        "Crafting blazing-fast, scalable apps with Next.js, React, and Tailwind CSS.",
      url: "https://muhammadzaeemaltaf.vercel.app/",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Muhammad Zaeem Altaf – Full-Stack Web Developer",
      description:
        "Building modern web apps with Next.js, React, and Tailwind CSS.",
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
              url: "https://muhammadzaeemaltaf.vercel.app/",
              jobTitle: "Full-Stack Web Developer",
              sameAs: [
                "https://github.com/muhammadzaeemaltaf",
                "https://pk.linkedin.com/in/muhammadzaeemaltaf",
              ],
              knowsAbout: [
                "Next.js",
                "React",
                "Tailwind CSS",
                "JavaScript",
                "TypeScript",
                "Laravel",
              ],
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BQCN3T0BVQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
            if (typeof window.gtag === 'function') {
              window.gtag('js', new Date());
              window.gtag('config', 'G-BQCN3T0BVQ');
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
