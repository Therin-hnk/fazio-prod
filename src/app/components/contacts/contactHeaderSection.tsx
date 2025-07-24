
import React from 'react';

const ContactHeaderSection = () => {
  return (
    <section className="bg-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-bold mb-4">Contactez-nous</h2>
      <p className="text-lg max-w-2xl">
        Nous sommes à votre écoute pour toute question concernant les événements, les votes ou
        l&apos;utilisation de la plateforme.
      </p>
    </section>
  );
};

export default ContactHeaderSection;