"use client";

declare global {
  interface Window {
    CRISP_WEBSITE_ID: string;
    $crisp: any[];
  }
}

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { ReactNode, useMemo } from "react"
import { usePathname } from "next/navigation"

// Liste des URLs où le header/footer doivent disparaître
const HIDDEN_LAYOUT_PATHS = [
  '/dashboard/login',
]

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const pathname = usePathname()

  // Détermine dynamiquement si le layout doit être caché
  const isHiddenLayout = useMemo(() => (
    HIDDEN_LAYOUT_PATHS.some(path => pathname?.startsWith(path))
  ), [pathname])

  useEffect(() => {
    const checkIfSmallScreen = () => {
      setIsSmallScreen(window.innerWidth < 1024); // <1024px = tablette ou mobile
    };
    checkIfSmallScreen();
    window.addEventListener("resize", checkIfSmallScreen);
    return () => window.removeEventListener("resize", checkIfSmallScreen);
  }, []);

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white">
        <Topbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isSmallScreen}
        />
      </div>

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        {
          !isHiddenLayout &&
            <div
              className={`
              ${isSmallScreen ? "fixed inset-0 z-20" : "fixed"} 
              ${
                sidebarOpen || !isSmallScreen
                  ? "translate-x-0"
                  : "-translate-x-full"
              } 
              w-56 bg-white h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out
              lg:translate-x-0
            `}
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
        }

        {/* Overlay pour mobile/tablette */}
        {isSmallScreen && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenu principal avec scroll */}
        <main
          className={`
          flex-1 overflow-y-auto
          ${isSmallScreen ? "ml-0" : "ml-56"}
          transition-all duration-300
          h-[calc(100vh-4rem)]
        `}
        >
          <div className="bg-gray-100 m-2 rounded-lg p-4 min-h-[calc(100%-3rem)]">
            {children}
          </div>
          <div className="bg-white text-sm py-3 w-full text-center sticky bottom-0">
            © 2025 Fazio-prod. Tous droits réservés
          </div>
        </main>
      </div>
    </div>
  );
}
