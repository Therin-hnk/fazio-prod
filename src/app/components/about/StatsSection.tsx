import React from 'react';

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-white mb-2">
        {value}
      </div>
      <div className="text-white/80 text-sm md:text-base font-light">
        {label}
      </div>
    </div>
  );
};

interface StatsProps {
  stats?: StatItemProps[];
}

export default function StatsSection({ stats }: StatsProps) {
  const defaultStats = [
    {
      value: "200+",
      label: "Événements Organisés"
    },
    {
      value: "50k+",
      label: "Votes Enregistrés"
    },
    {
      value: "1000+",
      label: "Participants"
    },
    {
      value: "98%",
      label: "Satisfaction Client"
    }
  ];

  const statsToDisplay = stats || defaultStats;

  return (
    <section className="bg-blue-800 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statsToDisplay.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}