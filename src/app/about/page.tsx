"use client"
import React from 'react';
import Mission from '../components/about/Mission';
import NotreHistoire from '../components/about/History';
import ValueSection from '../components/about/ValueSection';
import NotreEquipe from '../components/about/TeamSection';
import StatsSection from '../components/about/StatsSection';
import PartnersSection from '../components/about/PartnerSection';

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