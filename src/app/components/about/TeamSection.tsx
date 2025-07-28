import { TeamMemberCard } from "./TeamCard";

// Section complète de l'équipe
export default function NotreEquipe() {
  const equipe = [
    {
      imageUrl: "/teams/marc-fazio.png",
      name: "Marc Fazio",
      position: "Fondateur & CEO",
      description: "Visionnaire passionné par l'innovation dans le domaine de l'événementiel.",
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/marc-fazio' },
        { platform: 'twitter', url: 'https://twitter.com/marc_fazio' }
      ]
    },
    {
      imageUrl: "/teams/sophie-mercier.png",
      name: "Sophie Mercier",
      position: "Directrice Technique",
      description: "Experte en développement web avec une passion pour les interfaces intuitives.",
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/sophie-mercier' },
        { platform: 'github', url: 'https://github.com/sophie-mercier' }
      ]
    },
    {
      imageUrl: "/teams/thomas-legrand.png",
      name: "Thomas Legrand",
      position: "Directeur Marketing",
      description: "Stratège créatif avec une solide expérience dans l'événementiel et le digital.",
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/thomas-legrand' },
        { platform: 'instagram', url: 'https://instagram.com/thomas.legrand' }
      ]
    },
    {
      imageUrl: "/teams/emilie-dubois.png",
      name: "Émilie Dubois",
      position: "Responsable Clients",
      description: "Dévouée à offrir un support de qualité et à assurer la satisfaction des clients.",
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/emilie-dubois' },
        { platform: 'email', url: 'mailto:emilie@exemple.com' }
      ]
    }
  ];

  return (
    <section id="equipe-section" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Notre Équipe
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Des passionnés d&apos;événementiel et de technologie réunis pour vous offrir la meilleure expérience possible.
          </p>
        </div>

        {/* Grille des membres de l'équipe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-center">
          {equipe.map((membre, index) => (
            <TeamMemberCard
              key={index}
              imageUrl={membre.imageUrl}
              name={membre.name}
              position={membre.position}
              description={membre.description}
              socialLinks={membre.socialLinks}
            />
          ))}
        </div>
      </div>
    </section>
  );
}