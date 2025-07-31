import { ValueCard } from "./ValueCard";

// Composant principal avec la section complète
export default function ValueSection() {
  const valeurs = [
    {
      circleColor: "#E5E7EB",
      title: "Sécurité & Confiance",
      description: "Nous garantissons la sécurité des données et des transactions, créant un environnement de confiance pour tous nos utilisateurs."
    },
    {
      circleColor: "#FED7CC",
      title: "Innovation",
      description: "Nous repoussons constamment les limites de la technologie pour offrir des solutions événementielles toujours plus performantes."
    },
    {
      circleColor: "#D1FAE5",
      title: "Accessibilité",
      description: "Nous créons des outils intuitifs qui démocratisent l'organisation d'événements interactifs, quel que soit le niveau technique."
    }
  ];

  return (
    <section className="bg-gray-200 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Nos Valeurs
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Les principes qui guident chacune de nos actions et décisions.
          </p>
        </div>

        {/* Grille des cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {valeurs.map((valeur, index) => (
            <ValueCard
              key={index}
              circleColor={valeur.circleColor}
              title={valeur.title}
              description={valeur.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}