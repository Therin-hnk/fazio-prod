"use client"

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MenuBare from './components/menu';
import './globals.css';

import { ReactNode, useMemo } from "react"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const HIDDEN_LAYOUT_PATHS = [
  '/dashboard',
]

// Métadonnées optimisées pour le SEO
const metadata: Metadata = {
  title: 'Fazio Prod - Concours et Événements au Bénin',
  description:
    'Découvrez et participez aux concours artistiques et culturels au Bénin avec Fazio Prod. Votez pour vos talents préférés et vivez des événements uniques comme le Festival Voodoo et la Fête de la Gani.',
  keywords: [
    'Fazio Prod Bénin',
    'concours Bénin',
    'événements culturels Bénin',
    'vote en ligne',
    'Festival Voodoo',
    'Fête de la Gani',
    'talents béninois',
    'culture africaine',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '', // Remplacez par votre URL réelle
    title: 'Fazio Prod - Votre plateforme d’événements et concours au Bénin',
    description:
      'Rejoignez Fazio Prod pour voter, découvrir des talents et participer à des concours culturels au Bénin, de Porto-Novo à Ouidah.',
    images: [
      {
        url: '', // Remplacez par votre image
        width: 800,
        height: 600,
        alt: 'Fazio Prod - Concours et Événements au Bénin',
      },
    ],
  },
  icons: {
    icon: '/fazio-prod-logo.svg',
    apple: '/apple-touch-icon.png',
  },
};

// Données structurées Schema.org pour Fazio Prod
const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fazio Prod',
  url: '', // Remplacez par votre URL réelle
  logo: '',
  description:
    'Fazio Prod est une plateforme au Bénin dédiée aux concours artistiques, événements culturels comme le Festival Voodoo et la Fête de la Gani, et au vote en ligne pour soutenir les talents locaux.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue des Artistes', // Remplacez par votre adresse réelle
    addressLocality: 'Cotonou',
    addressRegion: 'Littoral',
    postalCode: '01 BP 1234', // Remplacez par votre code postal
    addressCountry: 'BJ',
  },
  telephone: '+22912345678', // Remplacez par votre numéro
  email: 'contact@fazioprod.bj', // Remplacez par votre email
  sameAs: [
    'https://www.facebook.com/fazioprod', // Remplacez par vos vrais liens
    'https://www.instagram.com/fazioprod',
    'https://www.youtube.com/@fazioprod',
  ],
  offers: {
    '@type': 'OfferCatalog',
    name: 'Services de Concours et Événements',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Concours Artistiques',
          description:
            'Organisation de concours pour révéler des talents en chant, danse, humour et arts traditionnels au Bénin.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Événements Culturels',
          description:
            'Spectacles et festivals culturels, dont le Festival Voodoo et la Fête de la Gani, à Ouidah, Porto-Novo et Cotonou.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Vote en Ligne',
          description:
            'Plateforme pour voter en ligne et soutenir les artistes béninois.',
        },
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // Détermine dynamiquement si le layout doit être caché
  const isHiddenLayout = useMemo(() => (
    HIDDEN_LAYOUT_PATHS.some(path => pathname?.startsWith(path))
  ), [pathname])

  return (
    <html className="bg-white dark:bg-gray-900" lang="fr">
      <head>
        <link href="https://fazio-prod.bj" rel="canonical" /> {/* Remplacez par votre URL */}
        <link href="/logo.png" rel="icon" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col text-gray-900 dark:text-gray-100`}>
        {/* Titres masqués pour SEO */}
        <h1 className="sr-only">Fazio Prod | Concours et Événements au Bénin</h1>
        <h2 className="sr-only">
          Participez à des concours artistiques, votez en ligne et découvrez des festivals culturels comme le Festival Voodoo au Bénin.
        </h2>

        {/* Liens internes masqués pour SEO */}
        <a className="sr-only" href="/">Accueil</a>
        <a className="sr-only" href="/#events">Nos Événements</a>
        <a className="sr-only" href="/vote">Voter</a>
        <a className="sr-only" href="/contact">Contactez-nous</a>
        <a className="sr-only" href="/mentions-legales">Mentions Légales</a>
        <a className="sr-only" href="/politique-confidentialite">Politique de Confidentialité</a>

        {/* Liens externes masqués */}
        <a className="sr-only" href="https://www.facebook.com/fazioprod">Fazio Prod sur Facebook</a>
        <a className="sr-only" href="https://www.instagram.com/fazioprod">Fazio Prod sur Instagram</a>
        <a className="sr-only" href="https://www.youtube.com/@fazioprod">Fazio Prod sur YouTube</a>

        {!isHiddenLayout && <MenuBare />}
        <main className="flex-grow font-poppins" role="main">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-100 py-6 text-center">
          <p>© {new Date().getFullYear()} Fazio Prod. Tous droits réservés.</p>
        </footer>
      </body>
    </html>
  );
}