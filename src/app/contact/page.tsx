"use client";
import React from "react";
import ContactHeaderSection from "../components/contacts/contactHeaderSection";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactAdressSection from "../components/contacts/ContactAdressSection";
import ContactFaqSection from "../components/contacts/ContactFaqSection";
import MapIframe from "../components/contacts/MapIframe";

export default function ContactPage() {
  const contactData = [
    {
      logo: <MapPin size={20} />,
      title: "Adresse",
      content: "02 BP 1410 Gbegamey, Cotonou, Bénin",
    },
    {
      logo: <Mail size={20} />,
      title: "Email",
      content: "fazioprod.inter@gmail.com",
    },
    {
      logo: <Phone size={20} />,
      title: "Téléphone",
      content: "+229 01 53 04 20 04",
    },
    {
      logo: <Clock size={20} />,
      title: "Horaires",
      content: "Lundi - Vendredi: 9h - 18h30\nSamedi: 9h - 14h",
    },
  ];

  const faqData = [
    {
      question: "Comment puis-je créer un événement sur Fazio Prod ?",
      response:
        "Pour créer un événement, vous devez d'abord vous inscrire en tant que promoteur. Une fois connecté à votre espace promoteur, cliquez sur 'Créer un événement' et suivez les étapes pour configurer votre émission et les tournois associés.",
    },
    {
      question: "Comment fonctionne le système de vote ?",
      response:
        "Les visiteurs peuvent voter pour leurs candidats favoris en achetant des votes. Le prix par vote est défini par l'organisateur du tournoi. Les paiements peuvent être effectués par carte bancaire ou via des solutions de paiement mobile.",
    },
    {
      question: "Comment un nominé peut-il consulter ses résultats ?",
      response:
        "Les nominés reçoivent une clé secrète unique leur permettant d'accéder à l'espace nominé. En saisissant cette clé et en sélectionnant l'événement concerné, ils peuvent consulter leurs statistiques de votes et leur statut dans le tournoi.",
    },
    {
      question: "Les paiements sont-ils sécurisés ?",
      response:
        "Oui, tous les paiements sont traités de manière sécurisée via des prestataires de paiement reconnus. Nous n'avons jamais accès à vos informations bancaires complètes et toutes les transactions sont cryptées.",
    },
  ];

  const socialLinksData = [
    {
      network: "facebook" as const,
      link: "https://www.facebook.com/share/1aKatGyX48/",
    },
    //{ network: "twitter" as const, link: "https://x.com/votrecompte" },
    {
      network: "instagram" as const,
      link: "https://www.instagram.com/fazioprod.officiel?igsh=dzE4a3R2b3MyeWQ4",
    },
    //{ network: "linkedin" as const, link: "https://linkedin.com/company/votrecompte"},
  ];

  const fazioPropMapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63424.61738239187!2d2.3912!3d6.3703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1db88c8c71d%3A0x6c0c1c0c1c0c1c0c!2sCotonou%2C%20B%C3%A9nin!5e0!3m2!1sfr!2sfr!4v1620000000000!5m2!1sfr!2sfr";
  return (
    <main className="bg-white min-h-screen">
      <ContactHeaderSection />
      <ContactAdressSection
        contactInfo={contactData}
        socialLinks={socialLinksData}
        onSubmit={async (data) => {
          // Votre logique d'envoi
          try {
            const response = await fetch("/api/public/send-email", {
              // Assurez-vous que le chemin de l'API est correct
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            if (response.ok) {
              const result = await response.json();
              alert("Votre message a été envoyé avec succès !"); // Retour utilisateur
              // Vous pourriez vouloir réinitialiser le formulaire ici
            } else {
              const errorData = await response.json();
              console.error("Échec de l'envoi de l'e-mail :", errorData);
              alert("Échec de l'envoi du message. Veuillez réessayer."); // Retour utilisateur
            }
          } catch (error) {
            console.error(
              "Une erreur est survenue lors de l'envoi de l'e-mail :",
              error
            );
            alert(
              "Une erreur est survenue. Veuillez vérifier votre connexion."
            ); // Retour utilisateur
          }
        }}
        //privacyPolicyLink="/confidentialite"
      />
      <section className="bg-[D1D5DB] p-6 rounded-lg shadow-sm w-full">
        <MapIframe
          src={fazioPropMapUrl}
          title="Notre Emplacement"
          height="500px"
          width="100%"
          className="w-[90%] max-w-6xl mx-auto"
        />
      </section>
      <ContactFaqSection faqItems={faqData} />
    </main>
  );
}
