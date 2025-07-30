import Image from 'next/image';
import { useEffect, useState } from 'react';
import PhasesTournoi from './PhasesTournoi';
import ParticipantsSection from './ParticipantsSection';
import { Event, Phase } from '@/app/dashboard/types/event';
import driveImageLoader from '@/app/lib/driveImageLoader';
import { toZonedTime } from 'date-fns-tz';

interface CountdownTimerProps {
  targetDate?: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate = toZonedTime(new Date('2024-12-31T23:59:59'), 'Africa/Lagos') 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = toZonedTime(new Date(), 'Africa/Lagos').getTime();
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
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center" aria-live="polite">
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

interface EventComponentProps {
  targetDate?: Date;
  emissionData?: Event;
  currentPhase?: Phase | null;
}

const EventComponent: React.FC<EventComponentProps> = ({ 
  targetDate, 
  emissionData,
  currentPhase
}) => {
  if (!emissionData) {
    return <div className="bg-white min-h-screen">Chargement ou aucune donnée disponible...</div>;
  }

  return (
    <div className="bg-white min-h-screen relative overflow-hidden pt-0">
      <div
        className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center text-white"
      >
        {emissionData.image && (
          <Image
            src={driveImageLoader({ src: emissionData.image })}
            alt="Image de l’émission"
            fill
            className="object-cover brightness-50 w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 px-6 text-center max-w-3xl space-y-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {emissionData.name}
          </h1>
          <p className="text-base sm:text-lg opacity-90">
            {emissionData.description || 'Aucune description disponible'}
          </p>
          {currentPhase && targetDate && (
            <div>
              <p className="text-sm sm:text-base mb-2">Fin de la phase actuelle dans :</p>
              <CountdownTimer targetDate={targetDate} />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PhasesTournoi
          currentPhaseId={currentPhase?.id}
          phases={emissionData.tournaments.flatMap(t => t.phases)}
        />
        <div className="mt-10" />
        <ParticipantsSection
          currentPhase={currentPhase}
          participants={currentPhase!.participants}
          tournament={emissionData.tournaments[0]}
        />
      </div>
    </div>
  );
};

export default EventComponent;