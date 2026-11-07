import React, { useState } from 'react';
import { Play, Pause, CheckCircle2 } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { TrackRow } from '../common/TrackRow';
import { MediaCard } from '../common/MediaCard';

interface ArtistViewProps {
  artistId: string;
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistId }) => {
  const { artists, navigate } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [isFollowing, setIsFollowing] = useState(false);

  const artist = artists.find(a => a.id === artistId);

  if (!artist) {
    return (
      <div className="flex-1 p-8 text-center text-[#b3b3b3]">
        <h3 className="text-xl font-bold text-white mb-2">Artist not found</h3>
        <button
          onClick={() => navigate({ type: 'home' })}
          className="px-4 py-2 bg-white text-black font-semibold rounded-full text-sm hover:scale-105 transition-transform"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isArtistPlaying =
    artist.topTracks.length > 0 &&
    currentTrack &&
    artist.topTracks.some(t => t.id === currentTrack.id) &&
    isPlaying;

  const handlePlayArtist = () => {
    if (artist.topTracks.length === 0) return;
    if (isArtistPlaying) {
      togglePlay();
    } else {
      playTrack(artist.topTracks[0], artist.topTracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-[#121212] rounded-lg">
      {/* Hero Banner with Header Photo */}
      <div
        className="relative h-72 sm:h-80 p-8 flex flex-col justify-end bg-cover bg-center shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(18,18,18,0.9)), url(${
            artist.headerUrl || artist.avatarUrl
          })`
        }}
      >
        <div className="flex items-center gap-1.5 text-xs text-[#1ed760] font-bold tracking-wider mb-2">
          <CheckCircle2 size={16} className="fill-[#1ed760] text-black" />
          <span className="uppercase text-white">Verified Artist</span>
        </div>
        <h1 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-none truncate mb-3">
          {artist.name}
        </h1>
        <p className="text-xs sm:text-sm text-white/90 font-medium">
          {artist.monthlyListeners}
        </p>
      </div>

      {/* Action Bar */}
      <div className="px-8 py-5 flex items-center gap-6">
        <button
          onClick={handlePlayArtist}
          className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-106 hover:bg-[#1fdf64] transition-all"
          aria-label={isArtistPlaying ? 'Pause' : 'Play artist'}
        >
          {isArtistPlaying ? (
            <Pause size={24} className="fill-black" />
          ) : (
            <Play size={24} className="fill-black ml-1" />
          )}
        </button>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 ${
            isFollowing
              ? 'border-[#1ed760] text-[#1ed760] bg-[#1ed760]/10'
              : 'border-white/40 text-white hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Content: Popular Tracks & Discography */}
      <div className="px-8 pb-12 flex flex-col gap-10">
        {/* Popular Tracks */}
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-white">Popular</h2>
          <div className="flex flex-col">
            {artist.topTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                contextQueue={artist.topTracks}
              />
            ))}
          </div>
        </section>

        {/* Discography */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Discography</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artist.albums.map(alb => (
              <MediaCard
                key={alb.id}
                title={alb.title}
                subtitle={`${alb.year} • Album`}
                imageUrl={alb.coverUrl}
                tracks={alb.tracks}
                onClick={() => navigate({ type: 'album', albumId: alb.id })}
              />
            ))}
          </div>
        </section>

        {/* Artist Bio Card */}
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-white">About</h2>
          <div className="p-6 rounded-lg bg-[#181818] max-w-2xl flex flex-col gap-3 border border-white/5 shadow-md">
            <h4 className="text-white font-bold text-lg">{artist.name}</h4>
            <p className="text-sm text-[#b3b3b3] leading-relaxed">{artist.bio}</p>
            <div className="text-xs text-[#1ed760] font-semibold mt-2">
              {artist.monthlyListeners}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

