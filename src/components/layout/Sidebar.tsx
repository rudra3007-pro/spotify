import React, { useState, useRef, useEffect } from 'react';
import {
  Library,
  Plus,
  Heart,
  Music,
  FolderPlus,
  Upload,
  Search,
  X
} from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';

interface SidebarProps {
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenUpload }) => {
  const {
    currentView,
    navigate,
    playlists,
    likedTrackIds,
    customTracks,
    createPlaylist
  } = useLibraryStore();

  const [width, setWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'playlists' | 'artists' | 'uploads'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Resize drag handle logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(220, Math.min(480, e.clientX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleCreatePlaylist = () => {
    const pl = createPlaylist();
    setShowAddMenu(false);
    navigate({ type: 'playlist', playlistId: pl.id });
  };

  const filteredPlaylists = playlists.filter(pl => {
    if (filter === 'uploads' || filter === 'artists') return false;
    if (searchFilter && !pl.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="relative flex flex-col bg-[#121212] rounded-lg p-2 gap-2 select-none h-full overflow-hidden flex-shrink-0"
    >
      {/* Header: Library Title + Plus Menu */}
      <div className="flex items-center justify-between px-3 py-2 text-[#b3b3b3]">
        <button
          onClick={() => navigate({ type: 'home' })}
          className="flex items-center gap-2 hover:text-white transition-colors"
          title="Collapse or expand Your Library"
        >
          <Library size={22} />
          <span className="font-bold text-sm tracking-tight text-white">Your Library</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors"
            title="Create playlist or upload audio"
          >
            <Plus size={20} />
          </button>

          {showAddMenu && (
            <div
              className="absolute right-0 top-10 z-50 w-52 bg-[#282828] border border-white/10 rounded-md shadow-2xl py-1 text-xs text-white"
              onMouseLeave={() => setShowAddMenu(false)}
            >
              <button
                onClick={handleCreatePlaylist}
                className="w-full text-left px-3 py-2.5 hover:bg-white/10 flex items-center gap-2.5"
              >
                <FolderPlus size={16} className="text-[#1ed760]" />
                <span>Create a new playlist</span>
              </button>
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onOpenUpload();
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-white/10 flex items-center gap-2.5"
              >
                <Upload size={16} className="text-[#aa3bff]" />
                <span>Upload custom audio files</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 px-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <button
          onClick={() => setFilter(filter === 'playlists' ? 'all' : 'playlists')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            filter === 'playlists'
              ? 'bg-white text-black font-semibold'
              : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
          }`}
        >
          Playlists
        </button>
        <button
          onClick={() => setFilter(filter === 'uploads' ? 'all' : 'uploads')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            filter === 'uploads'
              ? 'bg-white text-black font-semibold'
              : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
          }`}
        >
          Uploaded ({customTracks.length})
        </button>
        {filter !== 'all' && (
          <button
            onClick={() => setFilter('all')}
            className="p-1 rounded-full text-[#b3b3b3] hover:text-white"
            title="Clear filter"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search within library */}
      <div className="px-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-white/5 text-xs text-white">
          <Search size={14} className="text-[#b3b3b3]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search in Your Library"
            className="w-full bg-transparent focus:outline-none placeholder-[#b3b3b3] text-xs"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter('')} className="text-[#b3b3b3] hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Playlists & Uploads Scrollable List */}
      <div className="flex-1 overflow-y-auto px-1 flex flex-col gap-1">
        {/* Pinned Liked Songs Item */}
        {(filter === 'all' || filter === 'playlists') && (
          <div
            onClick={() => navigate({ type: 'liked' })}
            className={`group flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors ${
              currentView.type === 'liked' ? 'bg-white/10' : ''
            }`}
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center flex-shrink-0 shadow">
              <Heart size={20} className="fill-white text-white" />
            </div>
            <div className="min-w-0">
              <h5
                className={`text-sm font-semibold truncate ${
                  currentView.type === 'liked' ? 'text-[#1ed760]' : 'text-white'
                }`}
              >
                Liked Songs
              </h5>
              <p className="text-xs text-[#b3b3b3] truncate">
                📌 Playlist • {likedTrackIds.size} songs
              </p>
            </div>
          </div>
        )}

        {/* Custom Uploaded Library Tab */}
        {(filter === 'all' || filter === 'uploads') && customTracks.length > 0 && (
          <div
            onClick={() => navigate({ type: 'uploads' })}
            className={`group flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors ${
              currentView.type === 'uploads' ? 'bg-white/10' : ''
            }`}
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-[#aa3bff] to-[#1ed760] flex items-center justify-center flex-shrink-0 shadow">
              <Music size={20} className="text-black" />
            </div>
            <div className="min-w-0">
              <h5
                className={`text-sm font-semibold truncate ${
                  currentView.type === 'uploads' ? 'text-[#1ed760]' : 'text-white'
                }`}
              >
                Your Uploads
              </h5>
              <p className="text-xs text-[#b3b3b3] truncate">
                Local audio • {customTracks.length} tracks
              </p>
            </div>
          </div>
        )}

        {/* Playlists */}
        {filteredPlaylists.map(pl => {
          const isSelected =
            currentView.type === 'playlist' && currentView.playlistId === pl.id;

          return (
            <div
              key={pl.id}
              onClick={() => navigate({ type: 'playlist', playlistId: pl.id })}
              className={`group flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors ${
                isSelected ? 'bg-white/10' : ''
              }`}
            >
              <img
                src={pl.coverUrl}
                alt={pl.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <h5
                  className={`text-sm font-medium truncate ${
                    isSelected ? 'text-[#1ed760]' : 'text-white'
                  }`}
                >
                  {pl.title}
                </h5>
                <p className="text-xs text-[#b3b3b3] truncate">
                  {pl.isUserCreated ? 'By You' : 'Playlist'} • {pl.tracks.length} songs
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resize Handle Drag Bar */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[#1ed760] active:bg-[#1ed760] transition-colors z-20"
        title="Drag to resize library"
      />
    </aside>
  );
};

