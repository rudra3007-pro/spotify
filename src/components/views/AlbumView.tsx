import React from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { TrackRow } from '../common/TrackRow';
import { formatTime } from '../../utils/formatTime';

interface AlbumViewProps {
  albumId: string;
}

export const AlbumView: React.FC<AlbumViewProps> = ({ albumId }) => {
  const { albums, navigate } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const album = albums.find(a => a.id === albumId);

  if (!album) {
    return (
      <div className="flex-1 p-8 text-center text-[#b3b3b3]">
        <h3 className="text-xl font-bold text-white mb-2">Album not found</h3>
        <button
          onClick={() => navigate({ type: 'home' })}
          className="px-4 py-2 bg-white text-black font-semibold rounded-full text-sm hover:scale-105 transition-transform"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isAlbumPlaying =
    album.tracks.length > 0 &&
    currentTrack &&
    album.tracks.some(t => t.id === currentTrack.id) &&
    isPlaying;

  const totalSeconds = album.tracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (album.tracks.length === 0) return;
    if (isAlbumPlaying) {
      togglePlay();
    } else {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-[#121212] rounded-lg">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-[#5c2424] to-[#1e1e1e] flex flex-col sm:flex-row items-start sm:items-end gap-6 shadow-2xl">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-md shadow-2xl flex-shrink-0"
        />

        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs uppercase font-bold text-white tracking-widest">
            Album
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none truncate">
            {album.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/90 font-medium mt-2">
            <span
              onClick={() => navigate({ type: 'artist', artistId: album.artistId })}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              {album.artist}
            </span>
            <span>•</span>
            <span>{album.year}</span>
            <span>•</span>
            <span>{album.tracks.length} songs,</span>
            <span className="text-[#b3b3b3]">{formatTime(totalSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-6 bg-gradient-to-b from-[#1e1e1e] to-[#121212]">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-106 hover:bg-[#1fdf64] transition-all"
          aria-label={isAlbumPlaying ? 'Pause' : 'Play all'}
        >
          {isAlbumPlaying ? (
            <Pause size={24} className="fill-black" />
          ) : (
            <Play size={24} className="fill-black ml-1" />
          )}
        </button>
      </div>

      {/* Track List */}
      <div className="px-6 pb-12 flex-1">
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
          {album.tracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              contextQueue={album.tracks}
              showAlbum={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

