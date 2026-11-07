import { create } from 'zustand';
import { Track } from '../types/music';
import { audioService } from '../services/audioService';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;

  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleLyrics: () => void;
  toggleQueue: () => void;
  initAudioListeners: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off',
  isLyricsOpen: false,
  isQueueOpen: false,

  initAudioListeners: () => {
    audioService.registerCallbacks({
      onTimeUpdate: (currentTime) => set({ currentTime }),
      onDurationChange: (duration) => set({ duration }),
      onPlayStateChange: (isPlaying) => set({ isPlaying }),
      onLoadingChange: (isLoading) => set({ isLoading }),
      onEnded: () => {
        const { repeatMode, currentTrack, nextTrack, seek } = get();
        if (repeatMode === 'one' && currentTrack) {
          seek(0);
          audioService.play();
        } else {
          nextTrack();
        }
      },
      onError: (err) => {
        console.warn('Audio playback error callback:', err);
        set({ isPlaying: false, isLoading: false });
      }
    });

    // Set initial volume
    audioService.setVolume(get().volume);
  },

  playTrack: (track: Track, newQueue?: Track[]) => {
    let queue = get().queue;
    let queueIndex = 0;

    if (newQueue && newQueue.length > 0) {
      queue = [...newQueue];
      queueIndex = queue.findIndex(t => t.id === track.id);
      if (queueIndex === -1) {
        queue.unshift(track);
        queueIndex = 0;
      }
    } else {
      if (queue.length === 0) {
        queue = [track];
        queueIndex = 0;
      } else {
        const existingIdx = queue.findIndex(t => t.id === track.id);
        if (existingIdx !== -1) {
          queueIndex = existingIdx;
        } else {
          queue = [...queue, track];
          queueIndex = queue.length - 1;
        }
      }
    }

    set({ currentTrack: track, queue, queueIndex, currentTime: 0, duration: track.duration });
    audioService.loadAndPlay(track);

    // Sync Media Session Handlers
    audioService.updateMediaSession(track, {
      onPlay: () => get().resume(),
      onPause: () => get().pause(),
      onNext: () => get().nextTrack(),
      onPrev: () => get().prevTrack(),
      onSeek: (details) => {
        if (details.seekTime !== undefined) {
          get().seek(details.seekTime);
        }
      }
    });
  },

  togglePlay: () => {
    const { isPlaying, currentTrack, resume, pause } = get();
    if (!currentTrack) return;
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  },

  pause: () => {
    audioService.pause();
    set({ isPlaying: false });
  },

  resume: () => {
    const { currentTrack } = get();
    if (currentTrack) {
      audioService.play();
      set({ isPlaying: true });
    }
  },

  nextTrack: () => {
    const { queue, queueIndex, isShuffle, repeatMode, playTrack } = get();
    if (queue.length === 0) return;

    let nextIndex = queueIndex + 1;

    if (isShuffle && queue.length > 1) {
      let rand = queueIndex;
      while (rand === queueIndex) {
        rand = Math.floor(Math.random() * queue.length);
      }
      nextIndex = rand;
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // End of queue
        set({ isPlaying: false, currentTime: 0 });
        audioService.pause();
        return;
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      playTrack(nextSong, queue);
    }
  },

  prevTrack: () => {
    const { queue, queueIndex, currentTime, seek, playTrack } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart track
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    const prevSong = queue[prevIndex];
    if (prevSong) {
      playTrack(prevSong, queue);
    }
  },

  seek: (seconds: number) => {
    audioService.seek(seconds);
    set({ currentTime: seconds });
  },

  setVolume: (volume: number) => {
    audioService.setVolume(volume);
    set({ volume, isMuted: volume === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume } = get();
    if (isMuted) {
      const restored = volume === 0 ? 0.5 : volume;
      audioService.setMuted(false);
      audioService.setVolume(restored);
      set({ isMuted: false, volume: restored });
    } else {
      audioService.setMuted(true);
      set({ isMuted: true });
    }
  },

  toggleShuffle: () => {
    set(state => ({ isShuffle: !state.isShuffle }));
  },

  toggleRepeat: () => {
    const { repeatMode } = get();
    let nextMode: RepeatMode = 'off';
    if (repeatMode === 'off') nextMode = 'all';
    else if (repeatMode === 'all') nextMode = 'one';
    else nextMode = 'off';
    set({ repeatMode: nextMode });
  },

  addToQueue: (track: Track) => {
    set(state => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (index: number) => {
    set(state => {
      const newQueue = state.queue.filter((_, idx) => idx !== index);
      let newQueueIndex = state.queueIndex;
      if (index < state.queueIndex) {
        newQueueIndex -= 1;
      }
      return { queue: newQueue, queueIndex: newQueueIndex };
    });
  },

  clearQueue: () => {
    const { currentTrack } = get();
    set({ queue: currentTrack ? [currentTrack] : [], queueIndex: currentTrack ? 0 : -1 });
  },

  toggleLyrics: () => {
    set(state => ({ isLyricsOpen: !state.isLyricsOpen, isQueueOpen: false }));
  },

  toggleQueue: () => {
    set(state => ({ isQueueOpen: !state.isQueueOpen, isLyricsOpen: false }));
  }
}));

