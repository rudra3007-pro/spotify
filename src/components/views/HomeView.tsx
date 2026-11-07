import React from 'react';
import { Play, Heart, Music } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { MediaCard } from '../common/MediaCard';

export const HomeView: React.FC = () => {
  const {
    playlists,
    albums,
    artists,
    allTracks,
    likedTrackIds,
    customTracks,
    navigate
  } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // 6 quick access shortcut tiles
  const quickTiles = [
    {
      id: 'liked-tile',
      title: 'Liked Songs',
      coverUrl: null,
      isLiked: true,
      tracks: allTracks.filter(t => likedTrackIds.has(t.id)),
      onClick: () => navigate({ type: 'liked' })
    },
    ...playlists.slice(0, 5).map(pl => ({
      id: pl.id,
      title: pl.title,
      coverUrl: pl.coverUrl,
      isLiked: false,
      tracks: pl.tracks,
      onClick: () => navigate({ type: 'playlist', playlistId: pl.id })
    }))
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8 bg-gradient-to-b from-[#1e1e1e] via-[#121212] to-[#121212] rounded-lg">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{greeting}</h1>
      </div>

      {/* Quick 6-Tile Shortcut Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickTiles.map(tile => (
          <div
            key={tile.id}
            onClick={tile.onClick}
            className="group relative flex items-center bg-white/5 hover:bg-white/10 rounded-md overflow-hidden cursor-pointer transition-colors shadow-sm pr-4"
          >
            {tile.isLiked ? (
              <div className="w-16 h-16 bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center flex-shrink-0 shadow">
                <Heart size={24} className="fill-white text-white" />
              </div>
            ) : tile.coverUrl ? (
              <img
                src={tile.coverUrl}
                alt={tile.title}
                className="w-16 h-16 object-cover flex-shrink-0 shadow"
              />
            ) : (
              <div className="w-16 h-16 bg-[#282828] flex items-center justify-center flex-shrink-0">
                <Music size={24} className="text-[#1ed760]" />
              </div>
            )}

            <span className="font-bold text-sm text-white px-4 truncate flex-1">
              {tile.title}
            </span>

            {/* Hover Floating Play Button */}
            {tile.tracks.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTrack(tile.tracks[0], tile.tracks);
                }}
                className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105 flex-shrink-0"
                aria-label={`Play ${tile.title}`}
              >
                <Play size={18} className="fill-black ml-0.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Section: Made For You / Playlists */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            Featured Playlists
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map(pl => (
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

      {/* Section: Popular Albums */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            Popular Albums & EPs
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map(alb => (
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

      {/* Section: Featured Artists */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            Popular Artists
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map(art => (
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

      {/* Custom Uploads Shelf if user uploaded audio */}
      {customTracks.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
              Your Uploaded Music
            </h2>
            <button
              onClick={() => navigate({ type: 'uploads' })}
              className="text-xs font-bold text-[#b3b3b3] hover:underline"
            >
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {customTracks.slice(0, 5).map(track => (
              <MediaCard
                key={track.id}
                title={track.title}
                subtitle={`By ${track.artist} • Uploaded`}
                imageUrl={track.coverUrl}
                tracks={[track]}
                onClick={() => navigate({ type: 'uploads' })}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

