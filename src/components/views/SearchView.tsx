import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { TrackRow } from '../common/TrackRow';
import { MediaCard } from '../common/MediaCard';
import { SearchFilter } from '../../types/music';

const GENRE_CARDS = [
  { name: 'Lo-Fi Chill', color: 'from-orange-600 to-amber-700', query: 'Lo-Fi' },
  { name: 'Synthwave', color: 'from-purple-700 to-pink-600', query: 'Synthwave' },
  { name: 'Ambient & Classical', color: 'from-indigo-800 to-blue-900', query: 'Ambient' },
  { name: 'R&B & Soul', color: 'from-red-700 to-rose-900', query: 'R&B' },
  { name: 'EDM & Dance', color: 'from-emerald-600 to-teal-800', query: 'EDM' },
  { name: 'Indie Folk', color: 'from-yellow-700 to-amber-900', query: 'Folk' },
  { name: 'Summer Vibes', color: 'from-blue-600 to-cyan-700', query: 'Summer' },
  { name: 'Study & Focus', color: 'from-fuchsia-800 to-purple-950', query: 'Study' }
];

export const SearchView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    allTracks,
    artists,
    albums,
    playlists,
    navigate
  } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const [filter, setFilter] = useState<SearchFilter>('all');

  const query = searchQuery.trim().toLowerCase();

  // Search matches
  const matchedTracks = query
    ? allTracks.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          t.album.toLowerCase().includes(query) ||
          (t.genre && t.genre.toLowerCase().includes(query))
      )
    : [];

  const matchedArtists = query
    ? artists.filter(
        a =>
          a.name.toLowerCase().includes(query) ||
          a.bio.toLowerCase().includes(query)
      )
    : [];

  const matchedAlbums = query
    ? albums.filter(
        alb =>
          alb.title.toLowerCase().includes(query) ||
          alb.artist.toLowerCase().includes(query) ||
          alb.genre.toLowerCase().includes(query)
      )
    : [];

  const matchedPlaylists = query
    ? playlists.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    : [];

  // Top result candidate: best artist match or first track match
  const topArtist = matchedArtists[0];
  const topTrack = matchedTracks[0];

  const isTopTrackCurrent = topTrack && currentTrack?.id === topTrack.id;
  const isTopTrackPlaying = isTopTrackCurrent && isPlaying;

  const handleTopPlay = () => {
    if (topArtist && topArtist.topTracks.length > 0) {
      playTrack(topArtist.topTracks[0], topArtist.topTracks);
    } else if (topTrack) {
      if (isTopTrackCurrent) {
        togglePlay();
      } else {
        playTrack(topTrack, matchedTracks);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 bg-[#121212] rounded-lg">
      {/* Search Filter Chips */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          {(['all', 'tracks', 'artists', 'albums', 'playlists'] as SearchFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {f === 'tracks' ? 'Songs' : f}
            </button>
          ))}
        </div>
      )}

      {/* If Search Query is present */}
      {query ? (
        <div className="flex flex-col gap-8">
          {/* Top Result + Songs Section */}
          {(filter === 'all' || filter === 'tracks') && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Top Result Hero Card */}
              {(topArtist || topTrack) && filter === 'all' && (
                <div className="lg:col-span-2 flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-white">Top result</h3>
                  <div
                    onClick={() => {
                      if (topArtist) {
                        navigate({ type: 'artist', artistId: topArtist.id });
                      } else if (topTrack?.albumId) {
                        navigate({ type: 'album', albumId: topTrack.albumId });
                      }
                    }}
                    className="group relative p-5 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-colors flex flex-col gap-4 shadow-md"
                  >
                    <img
                      src={topArtist ? topArtist.avatarUrl : topTrack.coverUrl}
                      alt={topArtist ? topArtist.name : topTrack.title}
                      className={`w-24 h-24 object-cover shadow-lg ${
                        topArtist ? 'rounded-full' : 'rounded-md'
                      }`}
                    />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-2xl font-extrabold text-white truncate">
                        {topArtist ? topArtist.name : topTrack.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                        <span className="px-2 py-0.5 rounded-full bg-[#121212] font-semibold text-white uppercase text-[10px] tracking-wider">
                          {topArtist ? 'Artist' : 'Song'}
                        </span>
                        <span>{topArtist ? topArtist.monthlyListeners : topTrack.artist}</span>
                      </div>
                    </div>

                    {/* Floating Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTopPlay();
                      }}
                      className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                      aria-label="Play Top Result"
                    >
                      {isTopTrackPlaying ? (
                        <Pause size={22} className="fill-black" />
                      ) : (
                        <Play size={22} className="fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Songs List */}
              <div className={`${filter === 'all' ? 'lg:col-span-3' : 'lg:col-span-5'} flex flex-col gap-2`}>
                <h3 className="text-xl font-bold text-white mb-1">Songs</h3>
                {matchedTracks.length === 0 ? (
                  <p className="text-sm text-[#b3b3b3]">No songs match "{searchQuery}"</p>
                ) : (
                  <div className="flex flex-col">
                    {matchedTracks.slice(0, filter === 'all' ? 4 : 20).map((track, idx) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={idx}
                        contextQueue={matchedTracks}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Artists Section */}
          {(filter === 'all' || filter === 'artists') && matchedArtists.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white">Artists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchedArtists.map(art => (
                  <MediaCard
                    key={art.id}
                    title={art.name}
                    subtitle={art.monthlyListeners}
                    imageUrl={art.avatarUrl}
                    isCircular={true}
                    tracks={art.topTracks}
                    onClick={() => navigate({ type: 'artist', artistId: art.id })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {(filter === 'all' || filter === 'albums') && matchedAlbums.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white">Albums</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {matchedAlbums.map(alb => (
                  <MediaCard
                    key={alb.id}
                    title={alb.title}
                    subtitle={`${alb.year} • ${alb.artist}`}
                    imageUrl={alb.coverUrl}
                    tracks={alb.tracks}
                    onClick={() => navigate({ type: 'album', albumId: alb.id })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Playlists Section */}
          {(filter === 'all' || filter === 'playlists') && matchedPlaylists.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white">Playlists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {matchedPlaylists.map(pl => (
                  <MediaCard
                    key={pl.id}
                    title={pl.title}
                    subtitle={pl.description}
                    imageUrl={pl.coverUrl}
                    tracks={pl.tracks}
                    onClick={() => navigate({ type: 'playlist', playlistId: pl.id })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty search fallback */}
          {matchedTracks.length === 0 &&
            matchedArtists.length === 0 &&
            matchedAlbums.length === 0 &&
            matchedPlaylists.length === 0 && (
              <div className="py-16 text-center text-[#b3b3b3]">
                <h4 className="text-lg font-bold text-white mb-2">
                  No results found for "{searchQuery}"
                </h4>
                <p className="text-sm">
                  Please make sure your words are spelled correctly, or use fewer or different keywords.
                </p>
              </div>
            )}
        </div>
      ) : (
        /* Browse All Category Tiles when search query is empty */
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GENRE_CARDS.map(genre => (
              <div
                key={genre.name}
                onClick={() => setSearchQuery(genre.query)}
                className={`relative h-40 p-4 rounded-lg bg-gradient-to-br ${genre.color} cursor-pointer hover:scale-102 transition-transform shadow-md overflow-hidden flex flex-col justify-between`}
              >
                <h3 className="text-2xl font-extrabold text-white leading-tight">
                  {genre.name}
                </h3>
                <div className="self-end text-xs font-semibold text-white/80 bg-black/20 px-2 py-1 rounded">
                  Explore
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

