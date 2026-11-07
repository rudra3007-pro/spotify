import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Plus, Check } from 'lucide-react';
import { Track } from '../../types/music';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { formatTime } from '../../utils/formatTime';

interface TrackRowProps {
  track: Track;
  index: number;
  contextQueue?: Track[];
  showAlbum?: boolean;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  contextQueue,
  showAlbum = true
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { isLiked, toggleLikeTrack, playlists, addTrackToPlaylist, navigate } = useLibraryStore();
  const [showMenu, setShowMenu] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const isCurrent = currentTrack?.id === track.id;
  const isRowPlaying = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, contextQueue);
    }
  };

  const handleAddPlaylist = (playlistId: string, playlistTitle: string) => {
    addTrackToPlaylist(playlistId, track);
    setShowMenu(false);
    setAddedNotice(playlistTitle);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  return (
    <div
      className={`group relative grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] items-center gap-4 px-4 py-2 rounded-md hover:bg-white/10 transition-colors text-sm text-[#b3b3b3] ${
        isCurrent ? 'bg-white/5' : ''
      }`}
    >
      {/* Index or Play Button */}
      <div className="flex items-center justify-center w-4 text-center">
        {isRowPlaying ? (
          <div className="flex items-end gap-[2px] h-3.5 group-hover:hidden">
            <span className="w-[3px] bg-[#1ed760] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
            <span className="w-[3px] bg-[#1ed760] h-2/3 animate-[pulse_0.8s_ease-in-out_infinite]" />
            <span className="w-[3px] bg-[#1ed760] h-4/5 animate-[pulse_0.5s_ease-in-out_infinite]" />
          </div>
        ) : (
          <span className={`text-sm group-hover:hidden ${isCurrent ? 'text-[#1ed760]' : ''}`}>
            {index + 1}
          </span>
        )}
        <button
          onClick={handlePlayClick}
          className="hidden group-hover:flex items-center justify-center text-white hover:scale-110 transition-transform"
          aria-label={isRowPlaying ? 'Pause' : 'Play'}
        >
          {isRowPlaying ? (
            <Pause size={14} className="fill-white" />
          ) : (
            <Play size={14} className="fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Title & Artist */}
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-10 h-10 rounded object-cover flex-shrink-0 shadow-sm"
        />
        <div className="truncate">
          <div
            className={`font-normal truncate cursor-pointer hover:underline ${
              isCurrent ? 'text-[#1ed760] font-medium' : 'text-white'
            }`}
            onClick={handlePlayClick}
          >
            {track.title}
          </div>
          <div className="text-xs truncate text-[#b3b3b3]">
            {track.artistId ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ type: 'artist', artistId: track.artistId! });
                }}
                className="hover:underline hover:text-white cursor-pointer"
              >
                {track.artist}
              </span>
            ) : (
              track.artist
            )}
          </div>
        </div>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="hidden md:block truncate text-xs text-[#b3b3b3]">
          {track.albumId ? (
            <span
              onClick={() => navigate({ type: 'album', albumId: track.albumId! })}
              className="hover:underline hover:text-white cursor-pointer"
            >
              {track.album}
            </span>
          ) : (
            track.album
          )}
        </div>
      )}

      {/* Duration, Like, and More Actions */}
      <div className="flex items-center justify-end gap-3 pr-1 text-xs">
        <button
          onClick={() => toggleLikeTrack(track.id)}
          className={`hover:scale-110 transition-transform ${
            liked ? 'text-[#1ed760]' : 'text-transparent group-hover:text-[#b3b3b3] hover:text-white'
          }`}
          title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        >
          <Heart size={16} className={liked ? 'fill-[#1ed760]' : ''} />
        </button>

        <span className="w-9 text-right font-mono text-xs">{formatTime(track.duration)}</span>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-transparent group-hover:text-[#b3b3b3] hover:text-white transition-colors p-1"
            title="More options"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-8 z-50 w-52 bg-[#282828] border border-white/10 rounded-md shadow-2xl py-1 text-xs text-white"
              onMouseLeave={() => setShowMenu(false)}
            >
              <div className="px-3 py-1.5 text-[#b3b3b3] font-semibold uppercase tracking-wider text-[10px]">
                Add to Playlist
              </div>
              {playlists.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => handleAddPlaylist(pl.id, pl.title)}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between"
                >
                  <span className="truncate">{pl.title}</span>
                  <Plus size={13} className="text-[#b3b3b3]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {addedNotice && (
          <div className="absolute right-4 -top-6 bg-[#1ed760] text-black font-semibold text-[11px] px-2.5 py-0.5 rounded shadow-lg flex items-center gap-1 z-40">
            <Check size={12} /> Added to {addedNotice}
          </div>
        )}
      </div>
    </div>
  );
};

