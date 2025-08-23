'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import { LayoutDashboard, Tv2, Group, LucideUserPlus2, UserRoundCog, Microchip } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { GiRank2 } from 'react-icons/gi';

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [allowedNavItems, setAllowedNavItems] = useState<any[]>([]);

  // Tableau de correspondance des rôles et menus
  const roleNavItems: Record<string, string[]> = {
    ADMINISTRATOR: ['dashboard', 'emission', 'tournament', 'participant', 'phase', 'organizations', "advertissements", "classement"],
  };

  // Liste complète des éléments de navigation
  const navItems = [
    {
      label: 'Tableau de bord',
      href: '/dashboard',
      key: 'dashboard',
      icon: (isActive: boolean) => (
        <LayoutDashboard
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
    {
      label: 'Emissions',
      href: '/dashboard/emissions',
      key: 'emission',
      icon: (isActive: boolean) => (
        <Tv2
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
    {
      label: 'Gestion des catégories',
      href: '/dashboard/tournaments',
      key: 'tournament',
      icon: (isActive: boolean) => (
        <Group
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
    {
      label: 'Gestion des Phases',
      href: '/dashboard/phases',
      key: 'phase',
      icon: (isActive: boolean) => (
        <Group
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
    {
      label: 'Participants',
      href: '/dashboard/participants',
      key: 'participant',
      icon: (isActive: boolean) => (
        <LucideUserPlus2
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
    {
      label: 'Classements',
      href: '/dashboard/classements',
      key: 'classement',
      icon: (isActive: boolean) => (
        <GiRank2
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
    {
      label: 'Organisations',
      href: '/dashboard/organizations',
      key: 'organizations',
      icon: (isActive: boolean) => (
        <UserRoundCog
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
    {
      label: 'Publicités',
      href: '/dashboard/advertissements',
      key: 'advertissements',
      icon: (isActive: boolean) => (
        <Microchip
          className={isActive ? 'text-[#1E3A8A]' : 'text-gray-600'}
          size={20}
          aria-hidden="true"
        />
      ),
    },
  ];

  // Initialiser les éléments de navigation au montage
  useEffect(() => {
    // Fonction pour initialiser les éléments de navigation
    const initializeNavItems = () => {
      const currentRole = "ADMINISTRATOR";
      const filteredNavItems = currentRole && roleNavItems[currentRole]
        ? navItems.filter((item) => roleNavItems[currentRole].includes(item.key))
        : [];
      setRole(currentRole);
      setAllowedNavItems(filteredNavItems);
    };
    initializeNavItems();
  });

  // Vérifier l'authentification
  useEffect(() => {
    const token = Cookies.get('managerToken');
    if (!token && pathname !== '/dashboard/login') {
      window.location.href = '/dashboard/login';
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      Swal.fire({
        title: 'Déconnexion réussie',
        icon: 'success',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '400px',
      });
      document.cookie = 'managerToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('managerId');
      window.location.href = '/dashboard/login';
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: 'Échec de la déconnexion. Veuillez réessayer.',
        icon: 'error',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '400px',
      });
    }
  };

  // Si aucun rôle ou rôle non reconnu, afficher un message
  if (!role || !roleNavItems[role]) {
    return (
      <div className="w-56 bg-white fixed left-0 top-16 h-[calc(100vh-4rem)] lg:relative lg:top-0 lg:h-full flex items-center justify-center">
        <p className="text-gray-600 text-sm text-center">Accès non autorisé. Veuillez vous reconnecter.</p>
      </div>
    );
  }

  return (
    <div className="w-56 bg-white flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] md:h-full lg:relative lg:top-0 lg:h-full lg:pt-0">
      {/* Bouton de fermeture pour mobile */}
      <div className="lg:hidden flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-[#1E3A8A] transition-colors"
          aria-label="Fermer la barre de navigation"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Contenu principal de la sidebar */}
      <nav className="flex-1 flex flex-col p-4 overflow-y-auto mt-2" role="navigation" aria-label="Menu principal">
        <div className="flex-1 flex flex-col gap-3">
          {allowedNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <a
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1E3A8A] to-red-400 text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  aria-label={`Naviguer vers ${item.label}`}
                >
                  <span className="text-lg bg-white rounded-md p-2">{item.icon(isActive)}</span>
                  <span className="text-sm">{item.label}</span>
                </a>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Section de déconnexion */}
      <div className="p-4">
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#1E3A8A] text-[#1E3A8A] rounded-lg hover:bg-red-50 transition-colors duration-200"
          aria-label="Se déconnecter"
          role="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            width="15"
            height="20"
            viewBox="0 0 15 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6.12124 1C10.4726 1 14 5.02944 14 10C14 14.9706 10.4726 19 6.12125 19M4.1515 13.6L1 10M1 10L4.1515 6.4M1 10H10.8484"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Déconnexion</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;