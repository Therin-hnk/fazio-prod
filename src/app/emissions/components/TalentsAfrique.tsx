import Image from 'next/image';
import { useState, useEffect } from 'react';
import PhasesTournoi from './PhasesTournoi';
import ParticipantsSection from './ParticipantsSection';

interface CountdownTimerProps {
  targetDate?: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate = new Date('2024-12-31T23:59:59') 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Jours' },
    { value: timeLeft.hours, label: 'Heures' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Secondes' }
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="bg-orange-500 text-white px-2 py-2 sm:px-3 sm:py-3 rounded-xl shadow-lg min-w-[50px] sm:min-w-[60px] text-center">
            <div className="text-sm sm:text-base lg:text-lg font-bold">
              {unit.value.toString().padStart(2, '0')}
            </div>
          </div>
          <span className="text-white text-xs font-medium mt-1 opacity-90">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

interface EmissionData {
  id: string;
  name: string;
  title: string;
  description: string;
  targetDate: string;
  season: string;
  categories: string[];
  status: 'upcoming' | 'live' | 'ended';
}

interface TalentsAfriqueProps {
  targetDate?: Date;
  emissionData?: EmissionData;
}

const TalentsAfrique: React.FC<TalentsAfriqueProps> = ({ 
  targetDate, 
  emissionData 
}) => {
  const [activeTab, setActiveTab] = useState<'chant' | 'danse' | 'comedie'>('chant');

  const tabs = [
    { id: 'chant' as const, label: 'Chant' },
    { id: 'danse' as const, label: 'Danse' },
    { id: 'comedie' as const, label: 'Comédie' }
  ];

  return (
    <div className="bg-white min-h-screen relative overflow-hidden pt-20">
      {/* Background Wave */}
      <div className="absolute top-0 w-full mt-[-30px] inset-0 opacity-1 dark:opacity-40">
        <svg className="top-0" viewBox="0 0 1440 700" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,400 C480,300 960,500 1440,400 L1440,800 L0,800 Z" fill="#F97316" />
        </svg>
      </div>

      {/* Contenu principal */}
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 mb-8 lg:mb-12">
            
            {/* Section gauche - Logo et texte */}
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 text-center sm:text-left">
              <div className="bg-white rounded-full sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center shadow-xl">
                <Image width={30} height={30} src="/images/agonehmour.jpeg" unoptimized alt='' className='cover w-full h-full rounded-full'/>
              </div>
              
              <div className="bg-white p-4 rounded-lg text-gray-700 space-y-1 lg:space-y-2">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
                  {emissionData?.title || 'Talents d\'Afrique 2023'}
                </h1>
                <p className="text-sm sm:text-base opacity-90 font-light max-w-2xl">
                  {emissionData?.description || 'La plus grande compétition de talents du continent'}
                </p>
              </div>
            </div>

            {/* Section droite - Countdown */}
            <div className="flex flex-col items-center gap-4 lg:gap-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-3 lg:mb-4 font-medium">
                  ⏰ Fin de la phase actuelle dans
                </p>
                <CountdownTimer targetDate={targetDate} />
              </div>
            </div>
          </div>
        </div>

        <PhasesTournoi/>
        <div className='mt-10'></div>
         <ParticipantsSection/>
      </div>
    </div>
  );
};

export default TalentsAfrique;