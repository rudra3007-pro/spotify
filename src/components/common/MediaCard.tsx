import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { Track } from '../../types/music';

interface MediaCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  isCircular?: boolean;
  tracks?: Track[];
  onClick?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  subtitle,
  imageUrl,
  isCircular = false,
  tracks,
  onClick
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const isCurrentCardPlaying = 
    tracks && 
    tracks.length > 0 && 
    currentTrack && 
    tracks.some(t => t.id === currentTrack.id) && 
    isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!tracks || tracks.length === 0) return;

    if (isCurrentCardPlaying) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative p-3.5 bg-[#181818] hover:bg-[#282828] rounded-lg transition-all duration-300 cursor-pointer flex flex-col gap-3"
    >
      {/* Image container */}
      <div className="relative w-full aspect-square overflow-hidden shadow-lg">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isCircular ? 'rounded-full' : 'rounded-md'
          }`}
          loading="lazy"
        />

        {/* Floating Play Button */}
        {tracks && tracks.length > 0 && (
          <button
            onClick={handlePlayClick}
            className={`absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-108 hover:bg-[#1fdf64] ${
              isCurrentCardPlaying
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
            aria-label={isCurrentCardPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentCardPlaying ? (
              <Pause size={20} className="fill-black" />
            ) : (
              <Play size={20} className="fill-black ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* Text Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate">{title}</h4>
        <p className="text-[#b3b3b3] text-xs line-clamp-2 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

