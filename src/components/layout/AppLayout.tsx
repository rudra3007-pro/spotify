import React, { useState, useEffect } from 'react';
import { GlobalNavBar } from './GlobalNavBar';
import { Sidebar } from './Sidebar';
import { NowPlayingBar } from './NowPlayingBar';
import { RightPanel } from './RightPanel';
import { HomeView } from '../views/HomeView';
import { SearchView } from '../views/SearchView';
import { PlaylistView } from '../views/PlaylistView';
import { AlbumView } from '../views/AlbumView';
import { ArtistView } from '../views/ArtistView';
import { LikedSongsView } from '../views/LikedSongsView';
import { UploadsView } from '../views/UploadsView';
import { UploadModal } from '../views/UploadModal';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';

export const AppLayout: React.FC = () => {
  const { currentView } = useLibraryStore();
  const { initAudioListeners } = usePlayerStore();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    initAudioListeners();
  }, [initAudioListeners]);

  // Render view based on active navigation
  const renderView = () => {
    switch (currentView.type) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'playlist':
        return <PlaylistView playlistId={currentView.playlistId} />;
      case 'album':
        return <AlbumView albumId={currentView.albumId} />;
      case 'artist':
        return <ArtistView artistId={currentView.artistId} />;
      case 'liked':
        return <LikedSongsView />;
      case 'uploads':
        return <UploadsView onOpenUpload={() => setIsUploadOpen(true)} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white font-sans">
      {/* Top Global Navigation Bar */}
      <GlobalNavBar onOpenUpload={() => setIsUploadOpen(true)} />

      {/* Main Responsive Grid Area: Sidebar + Central Viewport + Context Drawer */}
      <div className="flex-1 flex gap-2 px-2 overflow-hidden min-h-0">
        {/* Left Resizable Library Sidebar */}
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        {/* Central Dynamic View (#main-view) */}
        <main
          id="main-view"
          tabIndex={-1}
          className="flex-1 flex flex-col overflow-hidden rounded-lg bg-[#121212] focus:outline-none"
        >
          {renderView()}
        </main>

        {/* Right Collapsible Panel (Lyrics, Queue, Credits) */}
        <RightPanel />
      </div>

      {/* Bottom Persistent Audio Player Controls */}
      <NowPlayingBar />

      {/* Custom Audio Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};

