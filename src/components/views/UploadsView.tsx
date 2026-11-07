import React from 'react';
import { Play, Pause, Upload, Trash2, Clock, Music } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { TrackRow } from '../common/TrackRow';
import { formatTime } from '../../utils/formatTime';

interface UploadsViewProps {
  onOpenUpload: () => void;
}

export const UploadsView: React.FC<UploadsViewProps> = ({ onOpenUpload }) => {
  const { customTracks, deleteCustomTrack } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const isUploadsPlaying =
    customTracks.length > 0 &&
    currentTrack &&
    customTracks.some(t => t.id === currentTrack.id) &&
    isPlaying;

  const totalSeconds = customTracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (customTracks.length === 0) return;
    if (isUploadsPlaying) {
      togglePlay();
    } else {
      playTrack(customTracks[0], customTracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-[#121212] rounded-lg">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-[#aa3bff]/80 to-[#1e1e1e] flex flex-col sm:flex-row items-start sm:items-end gap-6 shadow-2xl">
        <div className="w-44 h-44 sm:w-52 sm:h-52 bg-gradient-to-br from-[#aa3bff] to-[#1ed760] flex items-center justify-center rounded-md shadow-2xl flex-shrink-0">
          <Upload size={70} className="text-black" />
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs uppercase font-bold text-white tracking-widest">
            Local & Custom Files
          </span>
          <h1 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight leading-none truncate">
            Your Uploads
          </h1>
          <p className="text-xs text-[#b3b3b3]">
            Music imported directly from your computer. Fully playable and queueable.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/90 font-medium mt-2">
            <span className="font-bold text-white">Browser Storage</span>
            <span>•</span>
            <span>{customTracks.length} tracks,</span>
            <span className="text-[#b3b3b3]">{formatTime(totalSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-4 bg-gradient-to-b from-[#1e1e1e] to-[#121212]">
        <button
          onClick={handlePlayAll}
          disabled={customTracks.length === 0}
          className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-106 hover:bg-[#1fdf64] transition-all disabled:opacity-40"
          aria-label={isUploadsPlaying ? 'Pause' : 'Play all'}
        >
          {isUploadsPlaying ? (
            <Pause size={24} className="fill-black" />
          ) : (
            <Play size={24} className="fill-black ml-1" />
          )}
        </button>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Upload size={14} /> Upload More Audio
        </button>
      </div>

      {/* Track List */}
      <div className="px-6 pb-12 flex-1">
        {customTracks.length === 0 ? (
          <div className="py-16 text-center text-[#b3b3b3] flex flex-col items-center gap-3">
            <Music size={40} className="text-[#4d4d4d]" />
            <h4 className="text-base font-bold text-white">No custom audio uploaded yet</h4>
            <p className="text-xs">Drag and drop your MP3, WAV, or FLAC files here!</p>
            <button
              onClick={onOpenUpload}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#1ed760] text-black font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Upload size={14} /> Upload Audio Files
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] items-center gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider mb-2">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="hidden md:block">Source</span>
              <div className="flex items-center justify-end pr-5">
                <Clock size={16} />
              </div>
            </div>

            {/* Rows */}
            {customTracks.map((track, idx) => (
              <div key={track.id} className="relative group">
                <TrackRow
                  track={track}
                  index={idx}
                  contextQueue={customTracks}
                  showAlbum={false}
                />
                <button
                  onClick={() => deleteCustomTrack(track.id)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[#b3b3b3] hover:text-red-500 p-1 transition-opacity"
                  title="Delete uploaded track"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

