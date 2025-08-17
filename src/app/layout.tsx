// "use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MenuBare from "./components/menu";
import "./globals.css";

import { ReactNode } from "react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Métadonnées optimisées pour le SEO
export const metadata: Metadata = {
  title: "Fazio Prod - Concours et Événements au Bénin",
  description:
    "Découvrez et participez aux concours artistiques et culturels au Bénin avec Fazio Prod. Votez pour vos talents préférés et vivez des événements uniques comme le Festival Voodoo et la Fête de la Gani.",
  keywords: [
    "Fazio Prod Bénin",
    "concours Bénin",
    "événements culturels Bénin",
    "vote en ligne",
    "Festival Voodoo",
    "Fête de la Gani",
    "talents béninois",
    "culture africaine",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.fazioprod.com",
    title: "Fazio Prod - Votre plateforme d’événements et concours au Bénin",
    description:
      "Rejoignez Fazio Prod pour voter, découvrir des talents et participer à des concours culturels au Bénin, de Porto-Novo à Ouidah.",
    images: [
      {
        url: "https://www.fazioprod.com/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Fazio Prod - Concours et Événements au Bénin",
      },
    ],
  },
  icons: {
    icon: "/fazio-prod-logo.svg",
    apple: "/apple-touch-icon.png",
  },
};

// Données Schema.org pour JSON-LD
const schemaData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fazio Prod",
  url: "https://www.fazioprod.com",
  logo: "https://www.fazioprod.com/logo.png",
  description:
    "Fazio Prod est une plateforme au Bénin dédiée aux concours artistiques, événements culturels et vote en ligne.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue des Artistes",
    addressLocality: "Cotonou",
    addressRegion: "Littoral",
    postalCode: "01 BP 1234",
    addressCountry: "BJ",
  },
  telephone: "+22912345678",
  email: "contact@fazioprod.bj",
  sameAs: [
    "https://www.facebook.com/fazioprod",
    "https://www.instagram.com/fazioprod",
    "https://www.youtube.com/@fazioprod",
  ],
  offers: {
    "@type": "OfferCatalog",
    name: "Services de Concours et Événements",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Concours Artistiques",
          description:
            "Organisation de concours pour révéler des talents en chant, danse, humour et arts traditionnels au Bénin.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Événements Culturels",
          description:
            "Spectacles et festivals culturels, dont le Festival Voodoo et la Fête de la Gani.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Vote en Ligne",
          description: "Plateforme pour voter en ligne et soutenir les artistes béninois.",
        },
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html className="bg-white dark:bg-gray-900" lang="fr">
      <head>
        <link rel="canonical" href="https://www.fazioprod.com" />
        <link rel="icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col text-gray-900 dark:text-gray-100`}
      >
        {/* Titres et liens masqués pour SEO */}
        <h1 className="sr-only">
          Fazio Prod | Concours et Événements au Bénin
        </h1>
        <h2 className="sr-only">
          Participez à des concours artistiques, votez en ligne et découvrez des
          festivals culturels au Bénin.
        </h2>
        <a className="sr-only" href="/">
          Accueil
        </a>
        <a className="sr-only" href="/#events">
          Nos Événements
        </a>
        <a className="sr-only" href="/vote">
          Voter
        </a>
        <a className="sr-only" href="/contact">
          Contactez-nous
        </a>
        <a className="sr-only" href="/mentions-legales">
          Mentions Légales
        </a>
        <a className="sr-only" href="/politique-confidentialite">
          Politique de Confidentialité
        </a>
        <a className="sr-only" href="https://www.facebook.com/fazioprod">
          Fazio Prod sur Facebook
        </a>
        <a className="sr-only" href="https://www.instagram.com/fazioprod">
          Fazio Prod sur Instagram
        </a>
        <a className="sr-only" href="https://www.youtube.com/@fazioprod">
          Fazio Prod sur YouTube
        </a>

        {<MenuBare />}

        <main className="flex-grow font-poppins" role="main">
          {children}
        </main>

        <footer className="bg-gray-800 text-gray-100 py-6 text-center">
          <p>© {new Date().getFullYear()} Fazio Prod. Tous droits réservés.</p>
        </footer>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GER8R5Y5SH"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GER8R5Y5SH');
          `}
        </Script>
      </body>
    </html>
  );
}
