'use client';
import RankingsComponent from './components/RankingsComponent';

export default function ClassementPage() {

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <RankingsComponent/>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s;
        }
      `}</style>
    </div>
  );
}