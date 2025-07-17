import React from 'react';
import NewsCard, { NewsItem } from './NewsCard';

const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'Résultats des quarts de finale du tournoi "Voix d\'Or 2023"',
    description: 'Découvrez les candidats qualifiés pour les demi-finales après une soirée riche en émotions et en performances vocales exceptionnelles.',
    date: '5 Juillet 2023',
    category: 'Tournoi',
    categoryColor: 'text-blue-600',
    image: '/images/agonehmour.jpeg',
    slug: 'resultats-quarts-finale-voix-or-2023'
  },
  {
    id: '2',
    title: 'Nouvelle fonctionnalité de vote : soutenez vos candidats en quelques clics',
    description: 'Notre plateforme s\'enrichit d\'une nouvelle interface de vote intuitive et sécurisée pour permettre au public de soutenir ses talents préférés.',
    date: '28 Juin 2023',
    category: 'Technologie',
    categoryColor: 'text-orange-600',
    image: '/images/faismoirire.jpeg',
    slug: 'nouvelle-fonctionnalite-vote'
  },
  {
    id: '3',
    title: 'Fazio Prod s\'associe avec MediaStream pour la diffusion des événements',
    description: 'Un nouveau partenariat stratégique qui permettra une diffusion de nos événements sur de multiples plateformes et touchera un public plus large.',
    date: '15 Juin 2023',
    category: 'Partenariat',
    categoryColor: 'text-teal-600',
    image: '/images/Gemini_Generated_Image_zdnt48zdnt48zdnt.png',
    slug: 'partenariat-mediastream'
  },
  {
    id: '4',
    title: 'Portrait des 10 finalistes du concours "Étoiles Montantes"',
    description: 'Découvrez le parcours inspirant des dix finalistes qui s\'affronteront lors de la grande finale du 20 juillet prochain.',
    date: '8 Juin 2023',
    category: 'Participants',
    categoryColor: 'text-blue-600',
    image: '/images/talent1.png',
    slug: 'portrait-finalistes-etoiles-montantes'
  },
  {
    id: '5',
    title: 'Calendrier des prochains événements pour le second semestre 2023',
    description: 'Fazio Prod dévoile son programme d\'événements pour les six prochains mois avec trois nouveaux concepts de tournois.',
    date: '1 Juin 2023',
    category: 'Événements',
    categoryColor: 'text-orange-600',
    image: '/images/fais_moi_rire.jpg',
    slug: 'calendrier-evenements-2023'
  },
  {
    id: '6',
    title: 'Thomas Dubois remporte la finale de "Voix de Demain" avec un record de votes',
    description: 'Avec plus de 50 000 votes en sa faveur, le jeune talent de 23 ans s\'impose comme le grand gagnant de cette édition 2023.',
    date: '25 Mai 2023',
    category: 'Résultats',
    categoryColor: 'text-emerald-600',
    image: '/images/agone_humour.jpg',
    slug: 'thomas-dubois-gagnant-voix-demain'
  }
];

const NewsSection: React.FC = () => (
  <section className="py-16 bg-gray-50 dark:bg-gray-900" role="region" aria-label="Actualités récentes">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Actualités Récentes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Restez informé des dernières nouvelles, résultats de tournois et actualités de la plateforme d’événements Fazio Prod.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
      <div className="text-center mt-12">
        <a
          href="/actualites"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          aria-label="Voir toutes les actualités de Fazio Prod"
        >
          Voir toutes les actualités
        </a>
      </div>
    </div>
  </section>
);

export default NewsSection;