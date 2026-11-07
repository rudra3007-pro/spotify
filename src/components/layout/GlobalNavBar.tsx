import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  X,
  Upload,
  Heart,
  Music
} from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';

interface GlobalNavBarProps {
  onOpenUpload: () => void;
}

export const GlobalNavBar: React.FC<GlobalNavBarProps> = ({ onOpenUpload }) => {
  const {
    currentView,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    navigate,
    searchQuery,
    setSearchQuery
  } = useLibraryStore();

  const isSearchActive = currentView.type === 'search';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!isSearchActive) {
      navigate({ type: 'search', initialQuery: val });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="h-16 px-4 flex items-center justify-between gap-4 bg-black select-none z-30 flex-shrink-0">
      {/* Navigation history & Home shortcut */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-[#b3b3b3]">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={`w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center transition-colors ${
              canGoBack ? 'hover:bg-[#282828] text-white cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            title="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className={`w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center transition-colors ${
              canGoForward ? 'hover:bg-[#282828] text-white cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            title="Go forward"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Home pill button */}
        <button
          onClick={() => navigate({ type: 'home' })}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            currentView.type === 'home'
              ? 'bg-white text-black hover:scale-105'
              : 'bg-[#1f1f1f] text-white hover:scale-105 hover:bg-[#282828]'
          }`}
          title="Home"
        >
          <Home size={22} className={currentView.type === 'home' ? 'fill-black' : ''} />
        </button>
      </div>

      {/* Central Unified Search Bar */}
      <div className="flex-1 max-w-md mx-auto">
        <div
          onClick={() => {
            if (!isSearchActive) navigate({ type: 'search' });
          }}
          className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-all border ${
            isSearchActive ? 'border-white bg-[#242424]' : 'border-transparent'
          }`}
        >
          <Search size={18} className="text-[#b3b3b3] group-hover:text-white transition-colors flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="What do you want to play?"
            className="w-full bg-transparent text-sm text-white placeholder-[#b3b3b3] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearSearch();
              }}
              className="text-[#b3b3b3] hover:text-white transition-colors"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Upload custom audio, Liked shortcut, Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1f1f1f] hover:bg-[#282828] text-xs font-semibold text-white transition-all hover:scale-105 border border-white/10"
          title="Upload your own MP3 files"
        >
          <Upload size={14} className="text-[#1ed760]" />
          <span className="hidden sm:inline">Upload Audio</span>
        </button>

        <button
          onClick={() => navigate({ type: 'liked' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 ${
            currentView.type === 'liked'
              ? 'bg-[#1ed760] text-black'
              : 'bg-[#1f1f1f] text-white hover:bg-[#282828]'
          }`}
          title="Liked Songs"
        >
          <Heart size={14} className={currentView.type === 'liked' ? 'fill-black' : 'fill-white'} />
          <span className="hidden sm:inline">Liked</span>
        </button>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#1f1f1f] border border-white/20 p-0.5 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" title="User Profile">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#1ed760] to-[#aa3bff] flex items-center justify-center font-bold text-xs text-black">
            <Music size={15} />
          </div>
        </div>
      </div>
    </header>
  );
};

