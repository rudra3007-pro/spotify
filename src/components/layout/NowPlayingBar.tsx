import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Mic2,
  ListMusic
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { formatTime } from '../../utils/formatTime';

export const NowPlayingBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isLyricsOpen,
    isQueueOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLyrics,
    toggleQueue
  } = usePlayerStore();

  const { isLiked, toggleLikeTrack, navigate } = useLibraryStore();

  const liked = currentTrack ? isLiked(currentTrack.id) : false;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <footer className="h-20 bg-black border-t border-white/5 px-4 flex items-center justify-between gap-4 select-none z-30 flex-shrink-0">
      {/* Left: Track Information */}
      <div className="flex items-center gap-3 w-[30%] min-w-[180px]">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              onClick={() => {
                if (currentTrack.albumId) {
                  navigate({ type: 'album', albumId: currentTrack.albumId });
                }
              }}
              className="w-14 h-14 rounded object-cover shadow-md flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            />
            <div className="min-w-0 pr-2">
              <div
                onClick={() => {
                  if (currentTrack.albumId) {
                    navigate({ type: 'album', albumId: currentTrack.albumId });
                  }
                }}
                className="text-white text-sm font-normal truncate hover:underline cursor-pointer"
              >
                {currentTrack.title}
              </div>
              <div
                onClick={() => {
                  if (currentTrack.artistId) {
                    navigate({ type: 'artist', artistId: currentTrack.artistId });
                  }
                }}
                className="text-[#b3b3b3] text-xs truncate hover:underline hover:text-white cursor-pointer"
              >
                {currentTrack.artist}
              </div>
            </div>
            <button
              onClick={() => toggleLikeTrack(currentTrack.id)}
              className={`p-1.5 transition-transform hover:scale-110 flex-shrink-0 ${
                liked ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
            >
              <Heart size={18} className={liked ? 'fill-[#1ed760]' : ''} />
            </button>
          </>
        ) : (
          <div className="text-xs text-[#b3b3b3]">No track playing. Choose a song!</div>
        )}
      </div>

      {/* Center: Playback Controls and Timeline Scrubber */}
      <div className="flex flex-col items-center gap-1.5 max-w-[722px] w-[40%]">
        {/* Buttons Row */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={`transition-colors relative ${
              isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title="Enable shuffle"
          >
            <Shuffle size={16} />
            {isShuffle && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1ed760]" />}
          </button>

          <button
            onClick={prevTrack}
            disabled={!currentTrack}
            className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-40"
            title="Previous"
          >
            <SkipBack size={20} className="fill-current" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-40"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={17} className="fill-black" />
            ) : (
              <Play size={17} className="fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            disabled={!currentTrack}
            className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-40"
            title="Next"
          >
            <SkipForward size={20} className="fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`transition-colors relative ${
              repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}
            {repeatMode !== 'off' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1ed760]" />
            )}
          </button>
        </div>

        {/* Scrubber Row */}
        <div className="w-full flex items-center gap-2 text-xs font-mono text-[#b3b3b3]">
          <span className="w-9 text-right text-[11px]">{formatTime(currentTime)}</span>
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              disabled={!currentTrack}
              className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #1ed760 ${progressPercent}%, #4d4d4d ${progressPercent}%)`
              }}
            />
          </div>
          <span className="w-9 text-left text-[11px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Lyrics, Queue, Volume */}
      <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
        <button
          onClick={toggleLyrics}
          disabled={!currentTrack}
          className={`p-1.5 rounded transition-colors ${
            isLyricsOpen ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
          } disabled:opacity-40`}
          title="Lyrics"
        >
          <Mic2 size={18} />
        </button>

        <button
          onClick={toggleQueue}
          disabled={!currentTrack}
          className={`p-1.5 rounded transition-colors ${
            isQueueOpen ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
          } disabled:opacity-40`}
          title="Queue"
        >
          <ListMusic size={18} />
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 group w-32">
          <button
            onClick={toggleMute}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #1ed760 ${volumePercent}%, #4d4d4d ${volumePercent}%)`
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

