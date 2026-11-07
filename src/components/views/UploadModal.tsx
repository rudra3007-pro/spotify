import React, { useState, useRef } from 'react';
import { X, Upload, Music, CheckCircle } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { usePlayerStore } from '../../store/playerStore';
import { Track } from '../../types/music';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addCustomTrack, navigate } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processAudioFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    let count = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i)) {
        continue;
      }

      // Convert file into playable object URL or Base64 Data URL
      const audioUrl = URL.createObjectURL(file);

      // Measure duration with temporary audio object
      const duration = await new Promise<number>((resolve) => {
        const tempAudio = new Audio();
        tempAudio.src = audioUrl;
        tempAudio.addEventListener('loadedmetadata', () => {
          resolve(Math.round(tempAudio.duration) || 180);
        });
        tempAudio.addEventListener('error', () => {
          resolve(180);
        });
      });

      // Parse title and artist from filename e.g. "Coldplay - Yellow.mp3"
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      let title = cleanName;
      let artist = 'Local Artist';

      if (cleanName.includes(' - ')) {
        const parts = cleanName.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      const randomColors = [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
      ];
      const randomCover = randomColors[Math.floor(Math.random() * randomColors.length)];

      const newTrack: Track = {
        id: `upload-${Date.now()}-${i}`,
        title,
        artist,
        album: 'Local Uploads',
        duration,
        coverUrl: randomCover,
        audioUrl,
        isCustom: true,
        lyrics: [
          `Now playing your local audio file: ${file.name}`,
          'Audio decoded and rendered directly in your browser.'
        ]
      };

      addCustomTrack(newTrack);
      count++;

      // Automatically play first uploaded track
      if (i === 0) {
        playTrack(newTrack);
      }
    }

    setIsProcessing(false);
    setUploadedCount(count);

    if (count > 0) {
      setTimeout(() => {
        setUploadedCount(0);
        onClose();
        navigate({ type: 'uploads' });
      }, 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAudioFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAudioFiles(e.target.files);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#282828] border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-[#1ed760]" />
            <h3 className="text-xl font-bold text-white">Upload Custom Audio</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            isDragging
              ? 'border-[#1ed760] bg-[#1ed760]/10'
              : 'border-white/20 hover:border-white/40 bg-white/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center text-[#1ed760] shadow-inner">
            <Music size={28} />
          </div>

          <div className="text-center">
            <p className="text-white font-semibold text-base">
              Drag & Drop your audio files here
            </p>
            <p className="text-xs text-[#b3b3b3] mt-1">
              Supports MP3, WAV, FLAC, AAC, OGG, M4A
            </p>
          </div>

          <button
            type="button"
            className="mt-2 px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:scale-105 transition-transform"
          >
            Browse from computer
          </button>
        </div>

        {/* Status / Notice */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-sm text-[#1ed760]">
            <span className="w-4 h-4 border-2 border-[#1ed760] border-t-transparent rounded-full animate-spin" />
            Decoding audio metadata...
          </div>
        )}

        {uploadedCount > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-[#1ed760]">
            <CheckCircle size={18} />
            Successfully added {uploadedCount} tracks to your library!
          </div>
        )}

        {/* Footer info */}
        <p className="text-[11px] text-[#b3b3b3] text-center">
          Files are processed locally in your browser sandbox. No proprietary audio is uploaded to external servers.
        </p>
      </div>
    </div>
  );
};

