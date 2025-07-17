import React, { useState } from 'react';
import Image from 'next/image';

interface ParticipantCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  votePrice: number;
  totalVotes: number;
  youtubeLinks: string[];
  onVote: (id: string, voteCount: number, price: number) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  id,
  name,
  category,
  description,
  image,
  votePrice,
  totalVotes,
  youtubeLinks,
  onVote
}) => {
  const [voteCount, setVoteCount] = useState(1);
  const [showVotePopup, setShowVotePopup] = useState(false);
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const handleVote = () => {
    onVote(id, voteCount, votePrice*voteCount);
    setShowVotePopup(false);
    setVoteCount(1); // Reset après vote
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 relative w-full">
      {/* Popup de vote */}
      {showVotePopup && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-2xl">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="text-sm font-normal text-gray-900 mb-1">
                Voter pour <strong>{name}</strong>
              </h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Nombre de votes
                </span>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-600">
                    {(voteCount * votePrice).toLocaleString()} F
                  </div>
                  <div className="text-xs text-gray-500">
                    {votePrice}F × {voteCount}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVoteCount(Math.max(1, voteCount - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={voteCount}
                    onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full py-1 px-4 border border-gray-300 rounded-lg text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={() => setVoteCount(Math.min(100, voteCount + 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 text-[13px] flex-wrap">
              <button
                onClick={() => setShowVotePopup(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleVote}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image principale */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-white/20">
            {category}
          </span>
        </div>
        
        {/* Nombre de votes */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {totalVotes.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Contenu */}
      <div className="p-5">
        {/* Nom et description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Vidéos YouTube */}
        {youtubeLinks.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Vidéos
            </h4>
            <div className="flex flex-wrap gap-2">
              {youtubeLinks.slice(0, 3).map((link, index) => {
                const videoId = getYouTubeVideoId(link);
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/video relative overflow-hidden rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                  >
                    <div className="w-16 h-12 bg-gray-100 flex items-center justify-center">
                      {videoId ? (
                        <Image
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt={`Vidéo ${index + 1}`}
                          width={64}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover/video:bg-black/20 transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4 text-white opacity-0 group-hover/video:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </a>
                );
              })}
              {youtubeLinks.length > 3 && (
                <div className="w-16 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                  +{youtubeLinks.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Bouton de vote */}
        <button
          onClick={() => setShowVotePopup(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          Voter maintenant
        </button>
      </div>
    </div>
  );
};

export default ParticipantCard;