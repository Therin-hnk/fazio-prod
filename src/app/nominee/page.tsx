"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, SVGProps } from 'react';

import Cookies from 'js-cookie';

// Placeholder SVG Icons
const Lock = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Home = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ArrowRight = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Eye = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.06 18.06 0 0 1 5.34-5.34M14.12 14.12A3 3 0 1 0 12 10a3 3 0 0 0-1.74-.53" />
    <path d="M.83 2.83 2 4m18 18-1.17-1.17M10 10l4 4M2 2l20 20" />
  </svg>
);

export default function NominateConnexion() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return;

    if (Cookies.get('userId')) {
      router.push('/nominee/dashboard');
    }
  }, [router]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/participants/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker userId dans localStorage
        Cookies.set('userId', data.userId);
        router.push('/nominee/dashboard');
      } else {
        setError(data.message || 'Erreur de connexion. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Une erreur s\'est produite. Vérifiez votre connexion et réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('userId');
    router.refresh();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToContact = () => {
    router.push('/contact#contact-info');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Si l'utilisateur est connecté, afficher un message différent
  if (Cookies.get('isAuthenticated')) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vous êtes déjà connecté
          </h1>
          <p className="text-gray-600 mb-6">
            {"Vous avez déjà accès à l'espace nominés."}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/nominee/dashboard')}
              className="w-full bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition-all duration-200"
            >
              Aller au tableau de bord
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold text-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Form Section - Left */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Espace Nominés
              </h1>
              <p className="text-gray-600">
                Connectez-vous avec votre code secret
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Code secret
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre code secret"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !password.trim()}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>

            {/* Useful Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-3">
                <button
                  onClick={handleGoToContact}
                  className="text-gray-500 text-sm hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Code secret oublié ? Contactez l&apos;organisateur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Navigation Section - Right */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-8 bg-gray-800">
        <div className="text-center space-y-8 z-10">
          {/* Logo */}
          <div className="relative h-48 w-96 mx-auto">
            <Image
              src="/logo/logo1.png"
              alt="FazioProd Logo"
              fill
              className="object-contain filter drop-shadow-xl"
              priority
              sizes="(max-width: 768px) 300px, 400px"
            />
          </div>

          {/* Welcome Text */}
          <div className="text-orange-500 space-y-4">
            <h2 className="text-3xl font-bold">
              Bienvenue sur FazioProd
            </h2>
          </div>

          {/* Home Button */}
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold text-lg transition-all duration-200"
          >
            <Home className="w-6 h-6 mr-3" />
            Retour à l&apos;accueil
            <ArrowRight className="w-5 h-5 ml-3" />
          </button>

          {/* Additional Info */}
          <div className="text-white/70 text-sm">
            Accès réservé aux nominés uniquement
          </div>
        </div>
      </div>
    </div>
  );
}