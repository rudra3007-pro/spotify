import React from 'react';
import { Play, Pause, Heart, Clock, Music } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { TrackRow } from '../common/TrackRow';
import { formatTime } from '../../utils/formatTime';

export const LikedSongsView: React.FC = () => {
  const { allTracks, likedTrackIds, navigate } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const likedTracks = allTracks.filter(t => likedTrackIds.has(t.id));
  const totalSeconds = likedTracks.reduce((acc, t) => acc + t.duration, 0);

  const isLikedActive =
    likedTracks.length > 0 &&
    currentTrack &&
    likedTracks.some(t => t.id === currentTrack.id) &&
    isPlaying;

  const handlePlayAll = () => {
    if (likedTracks.length === 0) return;
    if (isLikedActive) {
      togglePlay();
    } else {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-[#121212] rounded-lg">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-[#450af5] to-[#1e1e1e] flex flex-col sm:flex-row items-start sm:items-end gap-6 shadow-2xl">
        <div className="w-44 h-44 sm:w-52 sm:h-52 bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center rounded-md shadow-2xl flex-shrink-0">
          <Heart size={80} className="fill-white text-white" />
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs uppercase font-bold text-white tracking-widest">
            Playlist
          </span>
          <h1 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight leading-none truncate">
            Liked Songs
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/90 font-medium mt-2">
            <span className="font-bold text-white">Your Collection</span>
            <span>•</span>
            <span>{likedTracks.length} songs,</span>
            <span className="text-[#b3b3b3]">{formatTime(totalSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-6 bg-gradient-to-b from-[#1e1e1e] to-[#121212]">
        <button
          onClick={handlePlayAll}
          disabled={likedTracks.length === 0}
          className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-106 hover:bg-[#1fdf64] transition-all disabled:opacity-40"
          aria-label={isLikedActive ? 'Pause' : 'Play all'}
        >
          {isLikedActive ? (
            <Pause size={24} className="fill-black" />
          ) : (
            <Play size={24} className="fill-black ml-1" />
          )}
        </button>
      </div>

      {/* Track List */}
      <div className="px-6 pb-12 flex-1">
        {likedTracks.length === 0 ? (
          <div className="py-16 text-center text-[#b3b3b3] flex flex-col items-center gap-3">
            <Music size={40} className="text-[#4d4d4d]" />
            <h4 className="text-base font-bold text-white">Songs you like will appear here</h4>
            <p className="text-xs">Save songs by tapping the heart icon on any track.</p>
            <button
              onClick={() => navigate({ type: 'search' })}
              className="mt-2 px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:scale-105 transition-transform"
            >
              Find songs
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] items-center gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider mb-2">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="hidden md:block">Album</span>
              <div className="flex items-center justify-end pr-5">
                <Clock size={16} />
              </div>
            </div>

            {/* Rows */}
            {likedTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                contextQueue={likedTracks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

