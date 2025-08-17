import React from 'react';
import Image from 'next/image';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  categoryColor: string;
  image: string;
  slug: string;
}

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div className="relative h-48 overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${item.categoryColor}`}>{item.category}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 leading-6">
        {item.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-5">
        {item.description}
      </p>
      <a
        href={`/actualites/${item.slug}`}
        className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        aria-label={`Lire l'article ${item.title}`}
      >
        <span>Lire la suite</span>
        <svg
          className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
);

export default NewsCard;