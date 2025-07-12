'use client';

import React from 'react';

interface VideoPlayerProps {
  youtubeUrl: string;
  title?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeUrl,
  title = 'Vidéo YouTube',
  className = '',
}) => {
  // Convertir l'URL YouTube en URL embeddable
  const getEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const embedUrl = getEmbedUrl(youtubeUrl);

  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900 dark:bg-gray-800 ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default VideoPlayer;