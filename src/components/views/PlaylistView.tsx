import React from 'react';
import { Play, Pause, Clock, Trash2, Shuffle, Music } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { TrackRow } from '../common/TrackRow';
import { formatTime } from '../../utils/formatTime';

interface PlaylistViewProps {
  playlistId: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlistId }) => {
  const { playlists, deletePlaylist, navigate } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay, toggleShuffle } = usePlayerStore();

  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="flex-1 p-8 text-center text-[#b3b3b3]">
        <h3 className="text-xl font-bold text-white mb-2">Playlist not found</h3>
        <button
          onClick={() => navigate({ type: 'home' })}
          className="px-4 py-2 bg-white text-black font-semibold rounded-full text-sm hover:scale-105 transition-transform"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isPlaylistActive =
    playlist.tracks.length > 0 &&
    currentTrack &&
    playlist.tracks.some(t => t.id === currentTrack.id) &&
    isPlaying;

  const totalSeconds = playlist.tracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (playlist.tracks.length === 0) return;
    if (isPlaylistActive) {
      togglePlay();
    } else {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.tracks.length === 0) return;
    toggleShuffle();
    const randomIndex = Math.floor(Math.random() * playlist.tracks.length);
    playTrack(playlist.tracks[randomIndex], playlist.tracks);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${playlist.title}"?`)) {
      deletePlaylist(playlist.id);
      navigate({ type: 'home' });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-[#121212] rounded-lg">
      {/* Header Banner with Rich Gradient */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-[#4d4d4d] to-[#1e1e1e] flex flex-col sm:flex-row items-start sm:items-end gap-6 shadow-2xl">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-md shadow-2xl flex-shrink-0"
        />

        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs uppercase font-bold text-white tracking-widest">
            {playlist.isUserCreated ? 'Custom Playlist' : 'Featured Playlist'}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none truncate">
            {playlist.title}
          </h1>
          <p className="text-sm text-[#b3b3b3] mt-2 line-clamp-2">
            {playlist.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/90 font-medium mt-1">
            <span className="font-bold text-white">Spotify Inspired</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs,</span>
            <span className="text-[#b3b3b3]">{formatTime(totalSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-6 bg-gradient-to-b from-[#1e1e1e] to-[#121212]">
        <button
          onClick={handlePlayAll}
          disabled={playlist.tracks.length === 0}
          className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-106 hover:bg-[#1fdf64] transition-all disabled:opacity-40"
          aria-label={isPlaylistActive ? 'Pause' : 'Play all'}
        >
          {isPlaylistActive ? (
            <Pause size={24} className="fill-black" />
          ) : (
            <Play size={24} className="fill-black ml-1" />
          )}
        </button>

        <button
          onClick={handleShufflePlay}
          disabled={playlist.tracks.length === 0}
          className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-40"
          title="Shuffle play"
        >
          <Shuffle size={24} />
        </button>

        {playlist.isUserCreated && (
          <button
            onClick={handleDelete}
            className="text-[#b3b3b3] hover:text-red-500 transition-colors ml-auto p-2"
            title="Delete this playlist"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Tracks Table */}
      <div className="px-6 pb-12 flex-1">
        {playlist.tracks.length === 0 ? (
          <div className="py-16 text-center text-[#b3b3b3] flex flex-col items-center gap-3">
            <Music size={40} className="text-[#4d4d4d]" />
            <h4 className="text-base font-bold text-white">This playlist is empty</h4>
            <p className="text-xs">Find songs using search and add them to this playlist!</p>
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
            {playlist.tracks.map((track, idx) => (
              <TrackRow
                key={`${track.id}-${idx}`}
                track={track}
                index={idx}
                contextQueue={playlist.tracks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

