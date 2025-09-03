'use client'

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<{ usernameOrEmail: boolean; password: boolean }>({
    usernameOrEmail: false,
    password: false,
  });
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Focus automatique sur le champ usernameOrEmail au chargement
  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: usernameOrEmail, password }),
      });

      const res = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: res.error || 'Erreur',
          text: res.message || 'Échec de l\'authentification. Veuillez vérifier vos identifiants.',
          icon: 'error',
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 7000,
          timerProgressBar: true,
          showCloseButton: true,
          width: '400px',
        });
        setErrorMessage(res.message || 'Erreur lors de la connexion');
      } else {
        const { userId, token, roleName } = res;

        // Stocker le token dans un cookie sécurisé
        Cookies.set('managerToken', token, { secure: true, sameSite: 'Strict' });

        // Stocker le userId et le role dans le Local Storage
        localStorage.setItem('managerId', userId);
        localStorage.setItem('userRole', roleName);

        // Redirection directe vers /manager
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Erreur',
        text: error.message || 'Une erreur s\'est produite, veuillez réessayer.',
        icon: 'error',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 7000,
        timerProgressBar: true,
        showCloseButton: true,
        width: '400px',
      });
      setErrorMessage(error.message || 'Une erreur s\'est produite, veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation en temps réel pour les champs vides
  const validateForm = () => {
    if (touched.usernameOrEmail && !usernameOrEmail) {
      return 'Veuillez entrer un identifiant.';
    }
    if (touched.password && !password) {
      return 'Veuillez entrer un mot de passe.';
    }
    return '';
  };

  const validationMessage = validateForm();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="bg-white rounded-lg shadow-sm max-w-md w-full p-6 sm:p-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-2xl font-bold text-left text-[#1E3A8A] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Se connecter à votre compte
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="usernameOrEmail" className="block text-[#170645] font-bold mb-2">
              Email
            </label>
            <input
              ref={usernameInputRef}
              type="email"
              id="usernameOrEmail"
              value={usernameOrEmail}
              placeholder="Votre identifiant de connexion"
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                setTouched((prev) => ({ ...prev, usernameOrEmail: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, usernameOrEmail: true }))}
              className="w-full border placeholder:text-[#170645] bg-white border-[#E6E6E6] rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              aria-label="Nom d'utilisateur ou Email"
              aria-describedby={validationMessage || errorMessage ? 'username-error' : undefined}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[#170645] font-bold mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                placeholder="Votre mot de passe"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched((prev) => ({ ...prev, password: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                className="w-full border placeholder:text-[#170645] bg-white border-[#E6E6E6] rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                aria-label="Mot de passe"
                aria-describedby={validationMessage || errorMessage ? 'password-error' : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {showPassword ? (
                    <path d="M12 4.5C5.25 4.5 1.5 12 1.5 12s3.75 7.5 10.5 7.5 10.5-7.5 10.5-7.5S18.75 4.5 12 4.5zm0 12c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-2c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z" fill="currentColor" />
                  ) : (
                    <path d="M3 3l18 18M12 4.5C5.25 4.5 1.5 12 1.5 12s3.75 7.5 10.5 7.5c2.07 0 4-1.07 5.55-2.93l-2.62-2.62C14.12 15.28 13.12 16 12 16c-2.76 0-5-2.24-5-5 0-1.12.31-2.17.86-3.07L3 3zm5.93 5.93C8.38 9.83 8 10.86 8 12c0 2.76 2.24 5 5 5 1.14 0 2.17-.38 3.07-.93l-2.62-2.62C12.28 13.88 11.28 14 10 14c-1.1 0-2-.9-2-2 0-.28.06-.55.15-.82l.78.75z" fill="currentColor" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {(validationMessage || errorMessage) && (
            <p
              id="form-error"
              className="text-red-800 text-sm text-center"
              role="alert"
            >
              {validationMessage || errorMessage}
            </p>
          )}
          <motion.button
            type="submit"
            className="w-full bg-[#1E3A8A] text-white py-3.5 mt-4 rounded-md flex items-center justify-center transition-all duration-200 hover:bg-[#1E3A8A] disabled:bg-[#1E3A8A44] disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label="Se connecter"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Connexion en cours...</span>
              </div>
            ) : (
              'Se connecter'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;