import { create } from "zustand";

type PlaybackStore = {
  volume: number;
  setVolume: (volume: number) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    play: () => void;
    pause: () => void;
    stop: () => void;
    progress: number;
    setProgress: (progress: number) => void;
}

const usePlaybackStore = create<PlaybackStore>((set) => ({
    isPlaying: false,
    volume: 0.5,
    setVolume: (volume) => set({ volume }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    stop: () => set({ isPlaying: false, progress: 0 }),
    progress: 0,
    setProgress: (progress) => set({ progress }),
}));

export const usePlayback = () => usePlaybackStore((state) => state);
