import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// Use CSS custom properties with system font fallbacks
// This avoids Google Fonts fetch timeouts during build
const fontVariables = {
  variable: "--font-geist-sans --font-geist-mono",
};

const siteUrl = "https://muhammadzaeemaltaf.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Muhammad Zaeem Altaf – Full-Stack Developer | Next.js, React, Laravel",
      template: "%s | Muhammad Zaeem Altaf – Full-Stack Developer",
    },
    description:
      "Full-Stack Developer specializing in Next.js, React, TypeScript, Laravel, and PHP. I build fast, scalable web applications.",
    keywords: [
      "Muhammad Zaeem Altaf",
      "Zaeem Altaf",
      "Full-Stack Developer",
      "Web Developer",
      "Developer",
      "Agentic Ai Developer",
      "Ai Developer",
      "Next.js Developer",
      "React Developer",
      "Laravel Developer",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "PHP Developer",
      "Frontend Developer",
      "Backend Developer",
      "Web Application Developer",
      "Portfolio",
      "Software Engineer",
      "Pakistan Developer",
      "Karachi Developer",
      "Freelance Developer",
      "UI/UX Developer",
    ],
    authors: [{ name: "Muhammad Zaeem Altaf", url: siteUrl }],
    creator: "Muhammad Zaeem Altaf",
    publisher: "Muhammad Zaeem Altaf",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: "Muhammad Zaeem Altaf – Full-Stack Web Developer",
      description:
        "Crafting blazing-fast, scalable web applications with Next.js, React, Tailwind CSS, and Laravel. View my portfolio of modern web solutions.",
      url: siteUrl,
      siteName: "Muhammad Zaeem Altaf Portfolio",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${siteUrl}/profile-pic.png`,
          width: 1200,
          height: 630,
          alt: "Muhammad Zaeem Altaf - Full-Stack Developer Portfolio",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "PdJjT4pzoRVp0RIH5aPM9sA5Eo9u4jC-8d8BxZwL-xc",
    },
    category: "technology",
    icons: {
      icon: "/favicon.ico",
      apple: "/favicon.ico",
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
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${siteUrl}#person`,
                  name: "Muhammad Zaeem Altaf",
                  url: siteUrl,
                  jobTitle: "Full-Stack Web Developer",
                  description: "Passionate Full-Stack Developer specializing in Next.js, React, TypeScript, Tailwind CSS, Laravel, and PHP",
                  sameAs: [
                    "https://github.com/muhammadzaeemaltaf",
                    "https://pk.linkedin.com/in/muhammadzaeemaltaf",
                  ],
                  knowsAbout: [
                    "Next.js",
                    "React",
                    "TypeScript",
                    "JavaScript",
                    "Tailwind CSS",
                    "Laravel",
                    "PHP",
                    "Python",
                    "MySQL",
                    "Node.js",
                    "Git",
                    "REST APIs",
                    "Web Development",
                    "Frontend Development",
                    "Backend Development",
                    "Full-Stack Development",
                    "Responsive Web Design",
                    "E-commerce Development",
                    "CMS Development",
                    "WordPress",
                    "Sanity CMS",
                    "GSAP Animation",
                    "Framer Motion",
                    "Zustand State Management",
                    "Shadcn UI",
                    "Bootstrap",
                    "jQuery",
                    "Ajax",
                    "Stripe Integration",
                    "Vercel Deployment",
                  ],
                  worksFor: {
                    "@type": "Organization",
                    name: "Innovative Widget",
                  },
                  alumniOf: {
                    "@type": "EducationalOrganization",
                    name: "Virtual University of Pakistan",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}#website`,
                  url: siteUrl,
                  name: "Muhammad Zaeem Altaf Portfolio",
                  description: "Personal portfolio website showcasing Full-Stack Development projects, skills, and experience",
                  author: {
                    "@id": `${siteUrl}#person`,
                  },
                  inLanguage: "en-US",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${siteUrl}/#search`,
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "ProfessionalService",
                  "@id": `${siteUrl}#organization`,
                  name: "Muhammad Zaeem Altaf - Full-Stack Developer",
                  url: siteUrl,
                  description: "Full-Stack Web Development services specializing in Next.js, React, Laravel, and modern web technologies",
                  priceRange: "$$",
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "Pakistan",
                  },
                  sameAs: [
                    "https://github.com/muhammadzaeemaltaf",
                    "https://pk.linkedin.com/in/muhammadzaeemaltaf",
                  ],
                },
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
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
