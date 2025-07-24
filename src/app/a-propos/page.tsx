"use client"
import React from 'react';
import Mission from '../components/a-propos/Mission';
import NotreHistoire from '../components/a-propos/History';
import ValueSection from '../components/a-propos/ValueSection';
import NotreEquipe from '../components/a-propos/TeamSection';
import StatsSection from '../components/a-propos/StatsSection';
import PartnersSection from '../components/a-propos/PartnerSection';

const AboutPage: React.FC = () => {
  return (
    <div>
      <Mission
        primaryButton={{
          text: "Notre histoire",
          targetId: "histoire-section"
        }}
        secondaryButton={{
          text: "Notre équipe",
          targetId: "equipe-section"
        }}
      />
      
      {/* Section Histoire */}
      <NotreHistoire/>
      <ValueSection />
      
      {/* Section Équipe */}
      <NotreEquipe/>
      <StatsSection/>
      <PartnersSection/>
    </div>
  );
};

export default AboutPage;