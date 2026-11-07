import { Track, Album, Artist, Playlist } from '../types/music';

// Public royalty-free MP3 streams (Creative Commons / Public Domain from archive.org and cdn test streams)
export const initialTracks: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight City Dreams',
    artist: 'Neon Mirage',
    artistId: 'artist-1',
    album: 'Retro Wave Odyssey',
    albumId: 'album-1',
    duration: 194,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    year: 2024,
    genre: 'Synthwave',
    playCount: 1420950,
    lyrics: [
      'Neon lights flicker on the boulevard',
      'Shadows dancing in the boulevard of rain',
      'Chasing the echoes of a midnight drive',
      'The bassline keeps the city alive',
      'In midnight city dreams, we are floating free',
      'Lost between the highway and the neon sea'
    ]
  },
  {
    id: 'track-2',
    title: 'Summer Breeze Lofi',
    artist: 'Luna Eclipse',
    artistId: 'artist-2',
    album: 'Sunsets & Coffee',
    albumId: 'album-2',
    duration: 145,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=summer-walk-111165.mp3',
    year: 2023,
    genre: 'Lo-Fi',
    playCount: 3890200,
    lyrics: [
      'Warm cup of coffee on the windowsill',
      'Morning breeze carries all the worries away',
      'Gentle rain tapping on the glass',
      'Take your time, let the moments pass',
      'Just a summer breeze, soft and slow',
      'Nowhere to rush, just let it flow'
    ]
  },
  {
    id: 'track-3',
    title: 'Neon Horizon',
    artist: 'Neon Mirage',
    artistId: 'artist-1',
    album: 'Retro Wave Odyssey',
    albumId: 'album-1',
    duration: 178,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3',
    year: 2024,
    genre: 'Synthwave',
    playCount: 924300,
    lyrics: [
      'Beyond the horizon where the sky turns pink',
      'Digital waves pulse in the electric air',
      'Driving fast toward the chrome sunrise',
      'Stars reflected in your sunglasses',
      'Neon horizon calling out my name',
      'Nothing in this cyber city is the same'
    ]
  },
  {
    id: 'track-4',
    title: 'Starlight Symphony',
    artist: 'Aetheria Ensemble',
    artistId: 'artist-3',
    album: 'Cosmic Horizons',
    albumId: 'album-3',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_82136e0931.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    year: 2023,
    genre: 'Ambient Cinematic',
    playCount: 1870420,
    lyrics: [
      'Stars drifting in the velvet night',
      'Strings vibrating with ancient light',
      'A solitary note across the dark expanse',
      'Galaxies spinning in a cosmic dance',
      'Listen to the symphony of the stars',
      'Healing all our quiet scars'
    ]
  },
  {
    id: 'track-5',
    title: 'Urban Groove Beats',
    artist: 'Marcus Vance',
    artistId: 'artist-4',
    album: 'Downtown Chronicles',
    albumId: 'album-4',
    duration: 160,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f775cb.mp3?filename=tuesday-glitch-122413.mp3',
    year: 2024,
    genre: 'R&B / Soul',
    playCount: 2450100,
    lyrics: [
      'Walking down the avenue under amber streetlights',
      'Rhythm in the pavement, footsteps in the night',
      'Bassline humming through the underground train',
      'Downtown groove washing out the pain',
      'Feel the snap, feel the swing',
      'Listen to what the city can bring'
    ]
  },
  {
    id: 'track-6',
    title: 'Acoustic Sunrise',
    artist: 'Clara Woods',
    artistId: 'artist-5',
    album: 'Wildflower Meadows',
    albumId: 'album-5',
    duration: 185,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_d0c6ff1e01.mp3?filename=acoustic-guitar-loop-f-91bpm-112041.mp3',
    year: 2022,
    genre: 'Indie Folk',
    playCount: 5120300,
    lyrics: [
      'Golden light across the green pine trees',
      'Acoustic strings whispering in the breeze',
      'Pack your bag and leave the town behind',
      'There is peace that you are meant to find',
      'Sunrise on the open trail',
      'Let the morning wind fill your sail'
    ]
  },
  {
    id: 'track-7',
    title: 'Velvet Raindrops',
    artist: 'Luna Eclipse',
    artistId: 'artist-2',
    album: 'Sunsets & Coffee',
    albumId: 'album-2',
    duration: 138,
    coverUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-chill-medium-version-159456.mp3',
    year: 2023,
    genre: 'Lo-Fi',
    playCount: 3120000,
    lyrics: [
      'Droplets sliding down the midnight pane',
      'Lo-fi keys blending with the rain',
      'Turn the page of an old paper book',
      'Lost in thought with a lingering look',
      'Velvet rain, take your time',
      'Turning quiet moments into rhyme'
    ]
  },
  {
    id: 'track-8',
    title: 'Electric Euphoria',
    artist: 'Pulse Velocity',
    artistId: 'artist-6',
    album: 'Hyperdrive',
    albumId: 'album-6',
    duration: 210,
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c352702174.mp3?filename=the-cradle-of-your-soul-15700.mp3',
    year: 2024,
    genre: 'EDM / Dance',
    playCount: 4620000,
    lyrics: [
      'Laser beams cutting through the haze',
      'Heartbeats synching up to the craze',
      'Hands up high reaching for the ceiling',
      'Nothing compares to this pure electric feeling',
      'Drop the beat, ignite the crowd',
      'We are alive, screaming out loud'
    ]
  }
];

export const initialAlbums: Album[] = [
  {
    id: 'album-1',
    title: 'Retro Wave Odyssey',
    artist: 'Neon Mirage',
    artistId: 'artist-1',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    year: 2024,
    genre: 'Synthwave',
    tracks: [initialTracks[0], initialTracks[2]]
  },
  {
    id: 'album-2',
    title: 'Sunsets & Coffee',
    artist: 'Luna Eclipse',
    artistId: 'artist-2',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    year: 2023,
    genre: 'Lo-Fi Chill',
    tracks: [initialTracks[1], initialTracks[6]]
  },
  {
    id: 'album-3',
    title: 'Cosmic Horizons',
    artist: 'Aetheria Ensemble',
    artistId: 'artist-3',
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    year: 2023,
    genre: 'Ambient Classical',
    tracks: [initialTracks[3]]
  },
  {
    id: 'album-4',
    title: 'Downtown Chronicles',
    artist: 'Marcus Vance',
    artistId: 'artist-4',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    year: 2024,
    genre: 'R&B / Soul',
    tracks: [initialTracks[4]]
  },
  {
    id: 'album-5',
    title: 'Wildflower Meadows',
    artist: 'Clara Woods',
    artistId: 'artist-5',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    year: 2022,
    genre: 'Indie Folk',
    tracks: [initialTracks[5]]
  },
  {
    id: 'album-6',
    title: 'Hyperdrive',
    artist: 'Pulse Velocity',
    artistId: 'artist-6',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    year: 2024,
    genre: 'EDM / Dance',
    tracks: [initialTracks[7]]
  }
];

export const initialArtists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Neon Mirage',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    headerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    bio: 'Pioneering futuristic synthwave, analog basslines, and neon nostalgia. Over 2M global streams.',
    monthlyListeners: '2,345,190 monthly listeners',
    topTracks: [initialTracks[0], initialTracks[2]],
    albums: [initialAlbums[0]]
  },
  {
    id: 'artist-2',
    name: 'Luna Eclipse',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    headerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    bio: 'Crafting cozy bedroom lo-fi beats, gentle pianos, and acoustic rain atmospheres.',
    monthlyListeners: '7,010,200 monthly listeners',
    topTracks: [initialTracks[1], initialTracks[6]],
    albums: [initialAlbums[1]]
  },
  {
    id: 'artist-3',
    name: 'Aetheria Ensemble',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    headerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    bio: 'Orchestral ambient composers scoring cosmic journeys and cinematic soundscapes.',
    monthlyListeners: '1,870,420 monthly listeners',
    topTracks: [initialTracks[3]],
    albums: [initialAlbums[2]]
  },
  {
    id: 'artist-4',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    headerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    bio: 'Smooth urban R&B and soulful grooves straight from the underground jazz clubs.',
    monthlyListeners: '3,120,500 monthly listeners',
    topTracks: [initialTracks[4]],
    albums: [initialAlbums[3]]
  },
  {
    id: 'artist-5',
    name: 'Clara Woods',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    headerUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&auto=format&fit=crop&q=80',
    bio: 'Acoustic singer-songwriter singing stories of wild meadows, mountain cabins, and freedom.',
    monthlyListeners: '5,120,300 monthly listeners',
    topTracks: [initialTracks[5]],
    albums: [initialAlbums[4]]
  },
  {
    id: 'artist-6',
    name: 'Pulse Velocity',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    headerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    bio: 'High-energy electronic producer headlining festivals across the globe.',
    monthlyListeners: '4,620,000 monthly listeners',
    topTracks: [initialTracks[7]],
    albums: [initialAlbums[5]]
  }
];

export const initialPlaylists: Playlist[] = [
  {
    id: 'playlist-top-50',
    title: 'Today\'s Top Hits',
    description: 'The hottest tracks right now, updated daily with fresh beats and viral anthems.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tracks: [initialTracks[0], initialTracks[1], initialTracks[5], initialTracks[7]]
  },
  {
    id: 'playlist-lofi-beats',
    title: 'Chill Lofi Study Session',
    description: 'Peaceful beats to study, relax, focus, or code to. Grab your warm beverage.',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    tracks: [initialTracks[1], initialTracks[6], initialTracks[3]]
  },
  {
    id: 'playlist-synthwave-nights',
    title: 'Synthwave & Retrowave',
    description: 'Cruising under neon streetlights at 2 AM with nostalgic 80s analog synthesizers.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    tracks: [initialTracks[0], initialTracks[2], initialTracks[7]]
  },
  {
    id: 'playlist-peaceful-piano',
    title: 'Deep Focus & Ambient Strings',
    description: 'Gentle classical melodies and tranquil ambient textures for deep work.',
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    tracks: [initialTracks[3], initialTracks[5]]
  }
];

