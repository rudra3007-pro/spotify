import { Track } from '../types/music';

type AudioEventCallback = {
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onEnded: () => void;
  onError: (error: string) => void;
};

class AudioService {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  private callbacks: AudioEventCallback | null = null;
  private isInitialized = false;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';

    this.setupEventListeners();
  }

  public registerCallbacks(callbacks: AudioEventCallback) {
    this.callbacks = callbacks;
  }

  private initAudioContext() {
    if (!this.isInitialized && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio API not supported or blocked by browser policy:', e);
      }
      this.isInitialized = true;
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private setupEventListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.callbacks?.onTimeUpdate(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.callbacks?.onDurationChange(this.audio.duration || 0);
      this.callbacks?.onLoadingChange(false);
    });

    this.audio.addEventListener('waiting', () => {
      this.callbacks?.onLoadingChange(true);
    });

    this.audio.addEventListener('playing', () => {
      this.callbacks?.onLoadingChange(false);
      this.callbacks?.onPlayStateChange(true);
    });

    this.audio.addEventListener('pause', () => {
      this.callbacks?.onPlayStateChange(false);
    });

    this.audio.addEventListener('ended', () => {
      this.callbacks?.onEnded();
    });

    this.audio.addEventListener('error', () => {
      const errorMsg = this.audio.error?.message || 'Playback error occurred';
      this.callbacks?.onError(errorMsg);
      this.callbacks?.onLoadingChange(false);
      this.callbacks?.onPlayStateChange(false);
    });
  }

  public async loadAndPlay(track: Track): Promise<void> {
    this.initAudioContext();
    this.callbacks?.onLoadingChange(true);

    this.audio.src = track.audioUrl;
    this.audio.load();

    this.updateMediaSession(track);

    try {
      await this.audio.play();
      this.callbacks?.onPlayStateChange(true);
    } catch (err) {
      console.warn('Playback request was prevented by autoplay restrictions or load issue:', err);
      this.callbacks?.onPlayStateChange(false);
    } finally {
      this.callbacks?.onLoadingChange(false);
    }
  }

  public async play(): Promise<void> {
    this.initAudioContext();
    try {
      await this.audio.play();
      this.callbacks?.onPlayStateChange(true);
    } catch (err) {
      console.warn('Play error:', err);
    }
  }

  public pause(): void {
    this.audio.pause();
    this.callbacks?.onPlayStateChange(false);
  }

  public seek(seconds: number): void {
    if (isFinite(seconds)) {
      this.audio.currentTime = seconds;
      this.callbacks?.onTimeUpdate(seconds);
    }
  }

  public setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.audio.volume = clamped;
  }

  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  public updateMediaSession(
    track: Track,
    handlers?: {
      onPlay?: () => void;
      onPause?: () => void;
      onNext?: () => void;
      onPrev?: () => void;
      onSeek?: (details: MediaSessionActionDetails) => void;
    }
  ) {
    if ('mediaSession' in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: track.coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: track.coverUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: track.coverUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: track.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      if (handlers?.onPlay) navigator.mediaSession.setActionHandler('play', handlers.onPlay);
      if (handlers?.onPause) navigator.mediaSession.setActionHandler('pause', handlers.onPause);
      if (handlers?.onNext) navigator.mediaSession.setActionHandler('nexttrack', handlers.onNext);
      if (handlers?.onPrev) navigator.mediaSession.setActionHandler('previoustrack', handlers.onPrev);
      if (handlers?.onSeek) navigator.mediaSession.setActionHandler('seekto', handlers.onSeek);
    }
  }
}

export const audioService = new AudioService();

