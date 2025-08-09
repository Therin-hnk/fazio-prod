'use client';

import React, { useState } from 'react';
import { Home, Search, Calendar, User, Users, Phone, Menu, X, Crown, Trophy } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const MenuBare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Récupère l'URL actuelle

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Search, label: 'Événements', href: '/#events' },
    { icon: Trophy, label: 'Espace Nominé', href: '/nominee' },
    // { icon: Users, label: 'À propos', href: '/about' },
    { icon: Phone, label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 font-poppins">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href='/'>
              <Image
                  src="/logo/logo2.png"
                  width={20} height={20}
                  alt='' className='w-[70px] h-[70px] object-contain'
                  unoptimized
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all duration-200 hover:bg-gray-100 relative ${
                  pathname === item.href 
                    ? 'text-orange-500 hover:text-orange-600' 
                    : 'text-gray-700 hover:text-orange-500'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                <span className={pathname === item.href ? 'border-b-2 border-orange-500' : ''}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Tablet Menu */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-gray-100 ${
                  pathname === item.href 
                    ? 'text-orange-500 hover:text-orange-600' 
                    : 'text-gray-700 hover:text-orange-500'
                }`}
                title={item.label}
              >
                <item.icon className={`w-4 h-4 ${pathname === item.href ? 'border-b-2 border-orange-500' : ''}`} />
              </a>
            ))}
          </div>

          {/* CTA Button Desktop/Tablet */}
          <div className="hidden md:flex items-center">
            <a href='/dashboard/login' className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 lg:px-6 py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
              Espace administrateur
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <a href='/dashboard/login' className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200">
              Espace administrateur
            </a>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-4 bg-white border-t border-gray-200">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
                pathname === item.href 
                  ? 'text-orange-500 bg-orange-50 border-l-4 border-orange-500' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-orange-500'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span className={pathname === item.href ? 'border-b border-orange-500' : ''}>
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MenuBare;