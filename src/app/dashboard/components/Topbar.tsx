// app/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface TopbarProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export default function Topbar({ onMenuToggle, isMobile }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isFetching, setIsFetching] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [profileBackup, setProfileBackup] = useState<UserProfile>({ ...profile });
  const isActive = pathname === '/notifications';
  const handleMenuClick = () => {
    setMenuOpen(false);
  };
  useEffect(() => {
    
  }, []);

  return (
    <nav className="sticky flex justify-between items-center w-full top-0 mx-auto bg-white backdrop-blur-lg z-50 h-16">
      {/* Partie gauche avec logo */}
      <div
        className="flex h-full pe-2 w-full"
      >
        <div
          className="flex bg-[#1E3A8A] w-full py-1"
        >
          <div className="flex">
            {/* Bouton menu pour mobile seulement */}
            { isMobile && (
              <button 
                onClick={onMenuToggle}
                className="border-r border-l-white w-[32px] pe-14"
              >
                <FiMenu className="text-white text-2xl" />
              </button>
            )}
            
            <Image
              width={96}
              height={96}
              src="/logo.png"
              alt="Fazio-prod logo"
              className="ml-4 ps-5 w-[120px] py-1 object-contain"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}