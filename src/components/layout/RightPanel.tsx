import React from 'react';
import { X, Trash2, Music } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';

export const RightPanel: React.FC = () => {
  const {
    currentTrack,
    queue,
    queueIndex,
    isLyricsOpen,
    isQueueOpen,
    currentTime,
    duration,
    toggleLyrics,
    toggleQueue,
    removeFromQueue,
    clearQueue,
    playTrack
  } = usePlayerStore();

  const { navigate } = useLibraryStore();

  if (!isLyricsOpen && !isQueueOpen) {
    return null;
  }

  // Calculate approximate active lyric index based on track progress
  const lyricLines = currentTrack?.lyrics || [
    'Lyrics are currently unavailable for this track.',
    'Enjoy the melody and rhythm!'
  ];
  const lyricProgress = duration > 0 ? currentTime / duration : 0;
  const activeLyricIndex = Math.min(
    lyricLines.length - 1,
    Math.floor(lyricProgress * lyricLines.length)
  );

  return (
    <div className="w-80 bg-[#121212] rounded-lg p-4 flex flex-col gap-4 select-none h-full overflow-hidden flex-shrink-0 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h3 className="text-white font-bold text-sm tracking-tight">
          {isLyricsOpen ? 'Lyrics' : 'Queue'}
        </h3>
        <button
          onClick={() => {
            if (isLyricsOpen) toggleLyrics();
            if (isQueueOpen) toggleQueue();
          }}
          className="text-[#b3b3b3] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Lyrics Content */}
      {isLyricsOpen && (
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 py-4">
          <div className="text-xs text-[#b3b3b3] uppercase tracking-wider font-semibold">
            {currentTrack?.title} • {currentTrack?.artist}
          </div>
          {lyricLines.map((line, idx) => {
            const isActive = idx === activeLyricIndex;
            const isPast = idx < activeLyricIndex;

            return (
              <p
                key={idx}
                className={`text-lg font-bold transition-all duration-300 leading-snug cursor-pointer ${
                  isActive
                    ? 'text-[#1ed760] scale-102 origin-left'
                    : isPast
                    ? 'text-white/80'
                    : 'text-white/40'
                } hover:text-white`}
              >
                {line}
              </p>
            );
          })}
        </div>
      )}

      {/* Queue Content */}
      {isQueueOpen && (
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 text-xs">
          {/* Now Playing */}
          {currentTrack && (
            <div>
              <div className="text-[#b3b3b3] uppercase tracking-wider font-bold mb-2">
                Now Playing
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-white/10">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[#1ed760] font-semibold truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-[#b3b3b3] truncate">{currentTrack.artist}</div>
                </div>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-between mt-2 mb-1">
              <span className="text-[#b3b3b3] uppercase tracking-wider font-bold">
                Next in queue
              </span>
              {queue.length > 1 && (
                <button
                  onClick={clearQueue}
                  className="text-xs text-[#b3b3b3] hover:text-white flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>

            {queue.slice(queueIndex + 1).length === 0 ? (
              <p className="text-[#b3b3b3] italic text-xs py-4 text-center">
                Queue is empty. Select songs or playlists to queue up next!
              </p>
            ) : (
              queue.slice(queueIndex + 1).map((track, relativeIdx) => {
                const actualIndex = queueIndex + 1 + relativeIdx;
                return (
                  <div
                    key={`${track.id}-${actualIndex}`}
                    className="group flex items-center justify-between gap-2 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div
                      className="flex items-center gap-2.5 min-w-0 flex-1"
                      onClick={() => playTrack(track, queue)}
                    >
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-white truncate font-medium group-hover:text-[#1ed760]">
                          {track.title}
                        </div>
                        <div className="text-[#b3b3b3] text-[11px] truncate">
                          {track.artist}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(actualIndex);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[#b3b3b3] hover:text-white p-1"
                      title="Remove from queue"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Artist Preview Card */}
          {currentTrack?.artistId && (
            <div
              onClick={() => navigate({ type: 'artist', artistId: currentTrack.artistId! })}
              className="mt-auto p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center flex-shrink-0">
                <Music size={18} className="text-[#1ed760]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-[#b3b3b3]">About the artist</div>
                <div className="text-white font-semibold truncate">{currentTrack.artist}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

