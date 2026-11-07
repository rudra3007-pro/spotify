export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  lyrics?: string[];
  isLiked?: boolean;
  isCustom?: boolean;
  year?: number;
  genre?: string;
  playCount?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  year: number;
  genre: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  headerUrl?: string;
  bio: string;
  monthlyListeners: string;
  topTracks: Track[];
  albums: Album[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  isUserCreated?: boolean;
  createdAt?: string;
}

export type ViewType = 
  | { type: 'home' }
  | { type: 'search'; initialQuery?: string }
  | { type: 'album'; albumId: string }
  | { type: 'artist'; artistId: string }
  | { type: 'playlist'; playlistId: string }
  | { type: 'liked' }
  | { type: 'uploads' };

export type SearchFilter = 'all' | 'tracks' | 'artists' | 'albums' | 'playlists';

