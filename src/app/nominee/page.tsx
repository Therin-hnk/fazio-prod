"use client"
import { useState } from 'react';
import Image from 'next/image';
import { JSX, SVGProps } from 'react';

// Placeholder SVG Icons (replace with actual icon library like lucide-react if available in your environment)
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

// Eye icon for showing/hiding password
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

// EyeOff icon for showing/hiding password
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
  const [password, setPassword] = useState(''); // Changed matricule to password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulation d'un appel API
    setTimeout(() => {
      setIsLoading(false);
      // Here you would add your login logic
      // For a real application, you would make a fetch call here
      // Example:
      // try {
      //   const response = await fetch('/api/login', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ password }),
      //   });
      //   const data = await response.json();
      //   if (response.ok) {
      // 
      //     // Redirect or update UI
      //   } else {
      //     console.error('Login failed:', data.message);
      //     // Show error message to user
      //   }
      // } catch (error) {
      //   console.error('Network error or unexpected issue:', error);
      // } finally {
      //   setIsLoading(false);
      // }
    }, 1500);
  };

  const handleGoHome = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  const handleGoToContact = () => {
    // Redirect to contact page
    window.location.href = '/contact#contact-info';
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col lg:flex-row">
      {/* Form Section - Left */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full mb-4">
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
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
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
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
                {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  Code secret oublié ?
                </button> */}
               
                <button 
                  onClick={handleGoToContact}
                  className="text-gray-500 text-sm hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Code secret oublié ? Contactez l&apos;organisateur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Navigation Section - Right */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="text-center space-y-8 z-10">
          {/* Logo */}
          <div className="relative h-48 w-96 mx-auto">
            <Image 
              src="/logo/logo1.png" 
              alt="FazioProd Logo" 
              fill
              className="object-contain filter drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 300px, 400px"
            />
          </div>

          {/* Welcome Text */}
          <div className="text-white space-y-4">
            <h2 className="text-3xl font-bold">
              Bienvenue sur FazioProd
            </h2>
          </div>

          {/* Home Button */}
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 group"
          >
            <Home className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Retour à l&apos;accueil
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Additional Info */}
          <div className="text-white/60 text-sm">
            Accès réservé aux nominés uniquement
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>
      </div>
    </div>
  );
}
