import React from 'react';
import Image from 'next/image';

interface PartnerProps {
  name: string;
  logoUrl?: string;
  logoComponent?: React.ReactNode;
  alt?: string;
  partnerUrl?: string;
}

const PartnerCard: React.FC<PartnerProps> = ({ 
  name, 
  logoUrl, 
  logoComponent, 
  alt,
  partnerUrl 
}) => {
  // Determine the content to display inside the card (logo component, image, or name)
  const content = logoComponent ? (
    logoComponent
  ) : logoUrl ? (
    <Image
      src={logoUrl}
      alt={alt || `Logo ${name}`}
      // Reduced image dimensions
      width={100} // Was 120
      height={50} // Was 60
      unoptimized={true} 
      className="object-contain"
    />
  ) : (
    // Reduced font size
    <span className="text-xl font-bold text-gray-600">{name}</span> // Was text-2xl
  );

  return (
    // Reduced padding and min-height for the card
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center min-h-[100px] hover:shadow-md transition-shadow duration-200"> {/* p-8 to p-6, min-h-[120px] to min-h-[100px] */}
      {/* If a partnerUrl is provided, wrap the content in an anchor tag */}
      {partnerUrl ? (
        <a 
          href={partnerUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center w-full h-full"
        >
          {content}
        </a>
      ) : (
        // Otherwise, just display the content
        content
      )}
    </div>
  );
};

interface PartnersProps {
  partners?: PartnerProps[];
}

const StripeIcon = () => (
  <svg width="70" height="30" viewBox="0 0 80 35" fill="none" xmlns="http://www.w3.org/2000/svg"> {/* width 80 to 70, height 35 to 30 */}
    <path d="M8.2 19.2c0-1.8 1.4-2.9 3.8-2.9 2.1 0 4.7.6 6.8 1.8v-6.3c-2.3-1-4.7-1.4-6.8-1.4-5.5 0-9.2 2.9-9.2 7.7 0 7.5 10.3 6.3 10.3 9.5 0 1.2-1.1 2-2.9 2-2.5 0-5.7-.9-8.2-2.2v6.4c2.6 1.2 5.5 1.8 8.2 1.8 5.6 0 9.4-2.8 9.4-7.6-.1-8.1-10.4-6.6-10.4-9.8zm14.1-8.6v23.2h6.4V18.3c1.3-1.7 3.4-2.8 5.8-2.8.4 0 .9 0 1.3.1v-6.2c-.4-.1-.8-.1-1.1-.1-2.2 0-4.4.9-6 2.6v-2.3h-6.4zm18.5 0v23.2h6.4V10.6h-6.4zm17.8-3.4c-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6-1.6-3.6-3.6-3.6zm-3.2 6.8v23.2h6.4V10.6h-6.4zm12.9 0v2.3c1.6-1.8 3.8-2.6 6-2.6 4.4 0 8.7 3.2 8.7 12.1s-4.3 12.1-8.7 12.1c-2.2 0-4.4-.9-6-2.6v11.3h-6.4V10.6h6.4zm0 11.9c0 3.4 1.8 5.7 4.6 5.7s4.6-2.3 4.6-5.7-1.8-5.7-4.6-5.7-4.6 2.3-4.6 5.7zm23.1-12.2c-6.7 0-11.6 4.7-11.6 12.1s4.8 12.1 11.4 12.1c3.4 0 6.6-.9 9.1-2.6v-5.3c-2.4 1.4-5.2 2.2-7.8 2.2-3.2 0-5.7-1.4-6.4-4.2h15.2c.1-.8.1-1.5.1-2.2 0-7.4-4.2-12.1-10-12.1zm-4.7 9.6c.6-2.6 2.4-4.1 4.7-4.1s4.1 1.5 4.7 4.1h-9.4z" fill="#00D924"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="70" height="49" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg"> {/* width 80 to 70, height 56 to 49 */}
    <path d="M78.4 8.7c-.9-3.4-3.6-6.1-7-7C65.1 0 40 0 40 0S14.9 0 8.6 1.7c-3.4.9-6.1 3.6-7 7C0 15 0 28 0 28s0 13 1.6 19.3c.9 3.4 3.6 6.1 7 7C14.9 56 40 56 40 56s25.1 0 31.4-1.7c3.4-.9 6.1-3.6 7-7C80 41 80 28 80 28s0-13-1.6-19.3z" fill="#FF0000"/>
    <path d="M32 40V16l21.6 12L32 40z" fill="#FFF"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg width="70" height="70" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"> {/* width 80 to 70, height 80 to 70 */}
    <circle cx="40" cy="40" r="40" fill="#1DB954"/>
    <path d="M58.4 34.8c-10.8-6.4-28.6-7-38.9-3.9-1.6.5-3.3-.4-3.8-2-.5-1.6.4-3.3 2-3.8 11.9-3.6 32.1-2.9 44.7 4.5 1.5.9 2 2.8 1.1 4.3-.9 1.5-2.8 2-4.3 1.1zm-.4 10.9c-.7 1.2-2.3 1.6-3.5.9-9.1-5.6-23-7.2-33.8-3.9-1.3.4-2.7-.3-3.1-1.6-.4-1.3.3-2.7 1.6-3.1 12.4-3.8 27.8-2 38.1 4.5 1.2.7 1.6 2.3.9 3.5zm-3.9 10.5c-.6 1-.1.6-2.8 0-7.3-4.5-16.5-5.5-27.3-3-.6.1-1.2-.3-1.3-.9-.1-.6.3-1.2.9-1.3 11.7-2.7 21.8-1.5 30.1 3.5 1 .6 1.3 1.8.7 2.8z" fill="#FFF"/>
  </svg>
);

const SoundCloudIcon = () => (
  <svg width="70" height="39" viewBox="0 0 80 45" fill="none" xmlns="http://www.w3.org/2000/svg"> {/* width 80 to 70, height 45 to 39 */}
    <path d="M2.4 27.3c-.4 0-.7-.3-.7-.7v-8.3c0-.4.3-.7.7-.7s.7.3.7.7v8.3c0 .4-.3.7-.7.7zm3.2.8c-.4 0-.8-.4-.8-.8V17.8c0-.4.4-.8.8-.8s.8.4.8.8v9.5c0 .4-.4.8-.8.8zm3.2.6c-.5 0-.9-.4-.9-.9V17.2c0-.5.4-.9.9-.9s.9.4.9.9v10.6c0 .5-.4.9-.9.9zm3.2.4c-.6 0-1-.4-1-1V16.8c0-.6.4-1 1-1s1 .4 1 1v11.3c0 .6-.4 1-1 1zm3.2.2c-.6 0-1.1-.5-1.1-1.1V16.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1v10.8c0 .6-.5 1.1-1.1 1.1zm3.2 0c-.7 0-1.2-.5-1.2-1.2V16c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v11.2c0 .7-.5 1.2-1.2 1.2zm3.2-.2c-.7 0-1.3-.6-1.3-1.3V15.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v11.6c0 .7-.6 1.3-1.3 1.3zm18.4 1.3c-1.9 0-3.4-1.5-3.4-3.4V15.2c0-1.9 1.5-3.4 3.4-3.4 12.6 0 22.8 10.2 22.8 22.8 0 1.9-1.5 3.4-3.4 3.4H42z" fill="#FF8C00"/>
  </svg>
);

export default function PartnersSection({ partners }: PartnersProps) {
  // Define default partners with their names, logo components, and partner URLs
  const defaultPartners: PartnerProps[] = [
    {
      name: "Stripe",
      logoComponent: <StripeIcon />,
      partnerUrl: "https://stripe.com" 
    },
    {
      name: "YouTube",
      logoComponent: <YouTubeIcon />,
      partnerUrl: "https://www.youtube.com" 
    },
    {
      name: "Spotify",
      logoComponent: <SpotifyIcon />,
      partnerUrl: "https://www.spotify.com" 
    },
    {
      name: "SoundCloud",
      logoComponent: <SoundCloudIcon />,
      partnerUrl: "https://soundcloud.com" 
    }
  ];

  // Use provided partners if available, otherwise fall back to default partners
  const partnersToDisplay = partners || defaultPartners;

  return (
    <section className="bg-gray-50 py-12 px-4"> {/* py-16 to py-12 */}
      <div className="max-w-5xl mx-auto"> {/* max-w-6xl to max-w-5xl */}
        {/* Section Header */}
        <div className="text-center mb-12"> {/* mb-16 to mb-12 */}
          <h2 className="text-2xl font-bold text-blue-800 mb-3"> {/* text-3xl to text-2xl, mb-4 to mb-3 */}
            Nos Partenaires
          </h2>
          <div className="w-10 h-1 bg-orange-500 mx-auto mb-4"></div> {/* w-12 to w-10, mb-6 to mb-4 */}
          <p className="text-gray-600 text-base max-w-xl mx-auto"> {/* text-lg to text-base, max-w-2xl to max-w-xl */}
            Des entreprises qui nous font confiance et soutiennent notre vision.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> {/* gap-6 to gap-4 */}
          {partnersToDisplay.map((partner, index) => (
            <PartnerCard
              key={index}
              name={partner.name}
              logoUrl={partner.logoUrl}
              logoComponent={partner.logoComponent}
              alt={partner.alt}
              partnerUrl={partner.partnerUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}