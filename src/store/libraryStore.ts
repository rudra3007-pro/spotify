import { create } from 'zustand';
import { Track, Playlist, Album, Artist, ViewType } from '../types/music';
import { initialTracks, initialPlaylists, initialAlbums, initialArtists } from '../data/mockCatalog';

interface LibraryState {
  // Navigation
  currentView: ViewType;
  history: ViewType[];
  forwardHistory: ViewType[];
  canGoBack: boolean;
  canGoForward: boolean;
  navigate: (view: ViewType) => void;
  goBack: () => void;
  goForward: () => void;

  // Catalog & Data
  allTracks: Track[];
  playlists: Playlist[];
  albums: Album[];
  artists: Artist[];
  likedTrackIds: Set<string>;
  customTracks: Track[];

  // Library actions
  toggleLikeTrack: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  createPlaylist: (title?: string) => Playlist;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addCustomTrack: (track: Track) => void;
  deleteCustomTrack: (trackId: string) => void;
  
  // Search query state for instant sync
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const STORAGE_KEY_LIKES = 'spotify_liked_tracks';
const STORAGE_KEY_PLAYLISTS = 'spotify_user_playlists';
const STORAGE_KEY_UPLOADS = 'spotify_custom_uploads';

const loadSavedLikes = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIKES);
    return raw ? new Set(JSON.parse(raw)) : new Set(['track-1', 'track-5']);
  } catch {
    return new Set(['track-1', 'track-5']);
  }
};

const loadSavedPlaylists = (): Playlist[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLAYLISTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialPlaylists;
};

const loadSavedUploads = (): Track[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UPLOADS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
};

export const useLibraryStore = create<LibraryState>((set, get) => {
  const savedLikes = loadSavedLikes();
  const savedPlaylists = loadSavedPlaylists();
  const savedUploads = loadSavedUploads();

  return {
    currentView: { type: 'home' },
    history: [],
    forwardHistory: [],
    canGoBack: false,
    canGoForward: false,

    allTracks: [...initialTracks, ...savedUploads],
    playlists: savedPlaylists,
    albums: initialAlbums,
    artists: initialArtists,
    likedTrackIds: savedLikes,
    customTracks: savedUploads,
    searchQuery: '',

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    navigate: (view: ViewType) => {
      const { currentView, history } = get();
      // Don't push duplicate view if identical
      if (JSON.stringify(currentView) === JSON.stringify(view)) return;

      const newHistory = [...history, currentView];
      set({
        currentView: view,
        history: newHistory,
        forwardHistory: [],
        canGoBack: true,
        canGoForward: false
      });
    },

    goBack: () => {
      const { history, currentView, forwardHistory } = get();
      if (history.length === 0) return;

      const previousView = history[history.length - 1];
      const newHistory = history.slice(0, history.length - 1);
      const newForward = [currentView, ...forwardHistory];

      set({
        currentView: previousView,
        history: newHistory,
        forwardHistory: newForward,
        canGoBack: newHistory.length > 0,
        canGoForward: true
      });
    },

    goForward: () => {
      const { forwardHistory, currentView, history } = get();
      if (forwardHistory.length === 0) return;

      const nextView = forwardHistory[0];
      const newForward = forwardHistory.slice(1);
      const newHistory = [...history, currentView];

      set({
        currentView: nextView,
        history: newHistory,
        forwardHistory: newForward,
        canGoBack: true,
        canGoForward: newForward.length > 0
      });
    },

    toggleLikeTrack: (trackId: string) => {
      set(state => {
        const next = new Set(state.likedTrackIds);
        if (next.has(trackId)) {
          next.delete(trackId);
        } else {
          next.add(trackId);
        }
        localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify([...next]));
        return { likedTrackIds: next };
      });
    },

    isLiked: (trackId: string) => {
      return get().likedTrackIds.has(trackId);
    },

    createPlaylist: (title?: string) => {
      const state = get();
      const count = state.playlists.filter(p => p.isUserCreated).length + 1;
      const newPlaylist: Playlist = {
        id: `user-playlist-${Date.now()}`,
        title: title || `My Playlist #${count}`,
        description: 'Created by you • Tap to customize and add tracks',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        tracks: [],
        isUserCreated: true,
        createdAt: new Date().toLocaleDateString()
      };

      const updated = [newPlaylist, ...state.playlists];
      localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
      set({ playlists: updated });
      return newPlaylist;
    },

    addTrackToPlaylist: (playlistId: string, track: Track) => {
      set(state => {
        const updated = state.playlists.map(pl => {
          if (pl.id === playlistId) {
            if (pl.tracks.some(t => t.id === track.id)) return pl;
            return { ...pl, tracks: [...pl.tracks, track] };
          }
          return pl;
        });
        localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
        return { playlists: updated };
      });
    },

    removeTrackFromPlaylist: (playlistId: string, trackId: string) => {
      set(state => {
        const updated = state.playlists.map(pl => {
          if (pl.id === playlistId) {
            return { ...pl, tracks: pl.tracks.filter(t => t.id !== trackId) };
          }
          return pl;
        });
        localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
        return { playlists: updated };
      });
    },

    deletePlaylist: (playlistId: string) => {
      set(state => {
        const updated = state.playlists.filter(pl => pl.id !== playlistId);
        localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
        return { playlists: updated };
      });
    },

    addCustomTrack: (track: Track) => {
      set(state => {
        const newUploads = [track, ...state.customTracks];
        const newAll = [track, ...state.allTracks];
        localStorage.setItem(STORAGE_KEY_UPLOADS, JSON.stringify(newUploads));
        return { customTracks: newUploads, allTracks: newAll };
      });
    },

    deleteCustomTrack: (trackId: string) => {
      set(state => {
        const newUploads = state.customTracks.filter(t => t.id !== trackId);
        const newAll = state.allTracks.filter(t => t.id !== trackId);
        localStorage.setItem(STORAGE_KEY_UPLOADS, JSON.stringify(newUploads));
        return { customTracks: newUploads, allTracks: newAll };
      });
    }
  };
});

