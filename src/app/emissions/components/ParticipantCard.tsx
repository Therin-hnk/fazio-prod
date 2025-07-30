import React, { useState } from 'react';
import Image from 'next/image';

interface ParticipantCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  votePrice: number;
  totalVotes: number;
  youtubeLinks: string[];
  onVote: (id: string, voteCount: number, price: number) => Promise<void>;
  maxVotes?: number;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  id,
  name,
  description,
  image,
  votePrice,
  totalVotes,
  youtubeLinks,
  onVote,
  maxVotes = 100,
}) => {
  const [voteCount, setVoteCount] = useState(1);
  const [showVotePopup, setShowVotePopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const handleVote = async () => {
    try {
      await onVote(id, voteCount, votePrice * voteCount);
      setShowVotePopup(false);
      setVoteCount(1);
      setError(null);
    } catch (err) {
      setError('Erreur lors du vote');
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 relative w-full max-w-md mx-auto">

      {/* --- POPUP VOTE --- */}
      {showVotePopup && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Voter pour <strong>{name}</strong>
              </h3>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
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
                  className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-xl font-bold">-</span>
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxVotes}
                  value={voteCount}
                  onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full py-1 px-4 border border-gray-300 rounded-lg text-center font-semibold text-lg focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={() => setVoteCount(Math.min(maxVotes, voteCount + 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-xl font-bold">+</span>
                </button>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                onClick={() => setShowVotePopup(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleVote}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP VIDEOS --- */}
      {showVideoPopup && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-5 max-w-2xl w-full relative">
            <button
              onClick={() => setShowVideoPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-center text-lg font-semibold mb-4 text-gray-800">Vidéos de {name}</h3>
            <div className="flex gap-3 overflow-x-auto">
              {youtubeLinks.map((link, index) => {
                const videoId = getYouTubeVideoId(link);
                return (
                  <iframe
                    key={index}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`Vidéo ${index + 1}`}
                    className="w-64 h-36 rounded-lg border"
                    allowFullScreen
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- IMAGE + VOTES --- */}
      <div className="relative h-60 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg> {totalVotes.toLocaleString()}
        </div>
      </div>

      {/* --- INFOS --- */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mt-1">{description}</p>
        </div>

        {youtubeLinks.length > 0 && (
          <div>
            <button
              onClick={() => setShowVideoPopup(true)}
              className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              🎬 Voir toutes les vidéos
            </button>
          </div>
        )}

        <button
          onClick={() => setShowVotePopup(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span>Voter maintenant</span>
        </button>
      </div>
    </div>
  );
};

export default ParticipantCard;
