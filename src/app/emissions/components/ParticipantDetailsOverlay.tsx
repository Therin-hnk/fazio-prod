'use client';

import React, { useState } from 'react';
import { Participant } from '@/app/dashboard/types/event';
import driveImageLoader from '@/app/lib/driveImageLoader';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ParticipantDetailsOverlayProps {
  participant: Participant;
  votePrice: number;
  tournamentId: string | undefined;
  phaseId: string | undefined;
  onVote: (participantId: string, voteCount: number, price: number, tournamentId: string | undefined, phaseId: string | undefined) => Promise<void>;
  onClose: () => void;
}

const ParticipantDetailsOverlay: React.FC<ParticipantDetailsOverlayProps> = ({
  participant,
  votePrice,
  tournamentId,
  phaseId,
  onVote,
  onClose,
}) => {
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

    const [voteCount, setVoteCount] = useState(1);
    const [showVotePopup, setShowVotePopup] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async () => {
        try {
            await onVote(participant.id, voteCount, votePrice * voteCount, tournamentId, phaseId);
            setShowVotePopup(false);
            setVoteCount(1);
            setError(null);
        } catch (err) {
            setError('Erreur lors du vote');
        }
    };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[888100001] flex items-start justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl p-0 w-full max-w-[1000px] shadow-2xl relative overflow-auto mt-20 max-h-[100%] pb-[150px]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-800 bg-orange-600 w-10 h-10 rounded-full flex items-center justify-center z-10"
          aria-label="Fermer"
        >
          ✕
        </button>
        <div className="flex flex-col gap-4">
          <div className="relative h-[100vh] rounded-lg overflow-hidden">
            <img
              src={driveImageLoader({ src: participant.avatarUrl || "" })}
              alt={`${participant.firstName} ${participant.lastName}`}
              className="object-contain w-full h-full"
            />
            {/* Conteneur pour le badge des votes et le bouton de vote */}
            <motion.div
              className="absolute top-4 left-4 flex flex-col gap-3 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Badge des votes */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm bg-opacity-80 hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>{participant.totalVotes?.toLocaleString() || 0} votes</span>
              </div>
              {/* Bouton de vote */}
              <motion.button
                onClick={() => {
                  setShowVotePopup(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm bg-opacity-80 hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>Voter maintenant</span>
              </motion.button>
            </motion.div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 p-6 pb-0">
            {participant.firstName} {participant.lastName}
          </h3>
          <p className="text-gray-600 text-sm p-6 pt-3">
            {participant.description}
          </p>
          {participant.videos && participant.videos.length > 0 && (
            <div className='p-6'>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Vidéos</h4>
              <div className="flex gap-3 overflow-x-auto">
                {participant.videos.map((video, index) => {
                  const videoId = getYouTubeVideoId(video.url);
                  return videoId ? (
                    <iframe
                      key={index}
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Vidéo ${index + 1}`}
                      className="w-48 h-28 rounded-lg border"
                      allowFullScreen
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* --- POPUP VOTE --- */}
        {showVotePopup && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100000000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center mb-4">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Voter
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
                    max={100000000}
                    value={voteCount}
                    onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full py-1 px-4 border border-gray-300 rounded-lg text-center font-semibold text-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setVoteCount(Math.min(100000000, voteCount + 1))}
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
      </div>
    </div>
  );
};

export default ParticipantDetailsOverlay;