import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Users, Clock, TrendingUp, Vote } from 'lucide-react';

// Interface pour une statistique
interface Stat {
  id: number;
  title: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}

// Interface pour les données de l'API
interface AnalyticsData {
  data: { pagePath: string; activeUsers: number; pageViews: number; avgSessionDuration: string; bounceRate: string }[];
  totals: {
    totalActiveUsers: number;
    totalPageViews: number;
    totalSessionTime: number;
    totalBounceRate: number;
    totalSessions: number;
    totalEngagedSessions: number;
    avgSessionDuration: string;
    bounceRate: string;
    engagementRate: string;
  };
  voteStats: {
    totalVotes: number;
    avgVotesPerDay: string;
    votesByDate: { date: string; voteCount: number }[];
  };
  metadata: {
    timeZone: string;
    currencyCode: string;
    dateRange: { startDate: string; endDate: string };
    rowCount: number;
  };
}

// Hook pour l'animation du compteur
const useCountAnimation = (endValue: number, duration: number = 2000, inView: boolean = false) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [endValue, duration, inView, hasAnimated]);

  return count;
};

// Composant pour une carte de statistique
const StatCard: React.FC<{ stat: Stat; delay: number }> = ({ stat, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animatedValue = useCountAnimation(stat.value, 2000 + delay * 100, isInView);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <motion.div
      ref={ref}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className={`absolute top-3 right-3 w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center opacity-30 group-hover:opacity-30 transition-opacity duration-500`}>
        <stat.icon className="w-6 h-6 text-white" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <div className={`p-2 ${stat.bgColor} rounded-xl shadow-lg mr-3`}>
            <stat.icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{stat.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
          </div>
        </div>
        <div className="mb-3">
          <span className={`text-2xl font-bold ${stat.color} dark:text-white`}>
            {formatNumber(animatedValue)}
          </span>
          <span className={`text-lg font-semibold ${stat.color} dark:text-white ml-1`}>
            {stat.suffix}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${stat.bgColor} rounded-full`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${Math.min((animatedValue / stat.value) * 100, 100)}%` } : { width: 0 }}
            transition={{ duration: 2, delay: delay * 0.1 + 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal
const WebsiteStatsSection: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeZone, setTimeZone] = useState('Africa/Lagos');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/public/analytics');
        const result: AnalyticsData = await response.json();
        if (response.ok) {
          // Utiliser les données globales de totals et voteStats
          const { totals, voteStats, metadata } = result;

          setStats([
            {
              id: 1,
              title: 'Visiteurs Uniques',
              value: totals.totalActiveUsers,
              suffix: '',
              icon: Users,
              color: 'text-blue-600',
              bgColor: 'bg-blue-500',
              description: 'Ce mois-ci',
            },
            {
              id: 2,
              title: 'Pages Vues',
              value: totals.totalPageViews,
              suffix: '',
              icon: Eye,
              color: 'text-green-600',
              bgColor: 'bg-green-500',
              description: 'Total des vues',
            },
            {
              id: 3,
              title: 'Temps Moyen',
              value: Math.round(Number(totals.avgSessionDuration) / 60), // Convertir secondes en minutes
              suffix: 'min',
              icon: Clock,
              color: 'text-purple-600',
              bgColor: 'bg-purple-500',
              description: 'Par session',
            },
            {
              id: 4,
              title: 'Taux de Rebond',
              value: Math.round(Number(totals.bounceRate)), // Déjà en pourcentage
              suffix: '%',
              icon: TrendingUp,
              color: 'text-orange-600',
              bgColor: 'bg-orange-500',
              description: 'En amélioration',
            },
            {
              id: 5,
              title: 'Votes Totaux',
              value: voteStats.totalVotes,
              suffix: '',
              icon: Vote,
              color: 'text-red-600',
              bgColor: 'bg-red-500',
              description: 'Sur 30 jours',
            },
            {
              id: 6,
              title: 'Votes Moyens par Jour',
              value: Math.round(Number(voteStats.avgVotesPerDay)), // Arrondir pour l'animation
              suffix: '',
              icon: Vote,
              color: 'text-pink-600',
              bgColor: 'bg-pink-500',
              description: 'Sur 30 jours',
            },
          ]);

          // Mettre à jour le fuseau horaire depuis metadata
          setTimeZone(metadata.timeZone || 'Africa/Lagos');
        } else {
          setError('Erreur lors de la récupération des données');
        }
      } catch (err) {
        setError('Une erreur s\'est produite. Vérifiez votre connexion et réessayez.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative bg-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Nos chiffres
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez les performances de notre site web en temps réel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} delay={index} />
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR', { timeZone })}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WebsiteStatsSection;