'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { Vote, Share2, Copy, Check, Facebook, Twitter, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticipantCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  votePrice: number;
  totalVotes: number;
  youtubeLinks: string[];
  onVote: (id: string, voteCount: number, price: number, tournamentId: string | undefined, phaseId: string | undefined) => Promise<void>;
  onLearnMore: (id: string) => void;
  maxVotes?: number;
  phaseId?: string;
  tournamentId?: string;
  isAvailable?: boolean;
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
  onLearnMore,
  maxVotes = 100,
  phaseId,
  tournamentId,
  isAvailable = true,
}) => {
  const [voteCount, setVoteCount] = useState(1);
  const [showVotePopup, setShowVotePopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construire l'URL de partage avec p_id et t_id
  const participantUrl = typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}${window.location.pathname}?p_id=${id}${tournamentId ? `&t_id=${tournamentId}` : ''}`
    : `https://your-default-domain.com/emission?p_id=${id}${tournamentId ? `&t_id=${tournamentId}` : ''}`; // Remplacer par votre domaine
  const shareText = `Découvrez "${name}" - ${description || 'Un participant à soutenir!'}`;
  const shareImage = image;

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const handleVote = async () => {
    try {
      await onVote(id, voteCount, votePrice * voteCount, tournamentId, phaseId);
      setShowVotePopup(false);
      setVoteCount(1);
      setError(null);
    } catch (err) {
      setError('Erreur lors du vote');
    }
  };

  const handleShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(participantUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(participantUrl)}&via=${encodeURIComponent('votreCompteTwitter')}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${participantUrl}`)}`;
        break;
      case 'instagram':
        copyToClipboard();
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      setShowShareMenu(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${participantUrl}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      setShowShareMenu(false);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      alert('Impossible de copier le lien. Veuillez le copier manuellement.');
    }
  };

  return (
    <>
      {/* Balises Open Graph pour le partage */}
      <Head>
        <meta property="og:title" content={name} />
        <meta property="og:description" content={description || 'Un participant à soutenir!'} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={participantUrl} />
        <meta property="og:type" content="website" />
      </Head>

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
                    max={10000000000}
                    value={voteCount}
                    onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full py-1 px-4 border border-gray-300 rounded-lg text-center font-semibold text-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setVoteCount(Math.min(10000000000, voteCount + 1))}
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

        {/* --- POPUP PARTAGE --- */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              className="absolute top-16 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-600 min-w-[200px] z-50"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Facebook className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Twitter className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-sm">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.512z"/>
                  </svg>
                  <span className="text-sm">WhatsApp</span>
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Lien copié!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copier le lien</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- IMAGE + VOTES + PARTAGE --- */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 hover:scale-105 transition-transform">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg> {totalVotes.toLocaleString()}
          </div>
          <div className="absolute top-3 left-3 z-30">
            <motion.button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="bg-white backdrop-blur-lg text-orange-600 p-2 rounded-full shadow-xl border border-white/20 transition-all duration-300 hover:bg-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* --- INFOS --- */}
        <div className="p-5 flex flex-col gap-4">
          <div className='flex-8'>
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

          <div className="flex gap-3 text-sm">
            {
              isAvailable ? (
                <button
                  onClick={() => setShowVotePopup(true)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>Voter</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Vote className="w-4 h-4" />
                  <span>indisponible</span>
                </button>
              )
            }
            
            <button
              onClick={() => onLearnMore(id)}
              className="flex-1 bg-blue-900 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-10a1 1 0 00-1 1v4a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span>voir</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticipantCard;