import { create } from "zustand";
import { AudioVisualizerConfig } from "../audio-visualizer/AudioVisualizer";

export type Beat = {
  title: string;
  src: string;
  config?: AudioVisualizerConfig;
};

type BeatStore = {
  beats: Beat[];
  nextBeat: () => void;
  prevBeat: () => void;
  selectedBeat: Beat;
  selectBeat: (beat: Beat) => void;
};

const beats: Beat[] = [
  {
    title: "ugly",
    src: "/beats/uglybutpretty.mp3",
    config: {
      backgroundColor: "black",
      nodes: [
        {
          type: "wave",
          params: {
            fillUnder: true,
            color: "white",
            amplitude: 3,
            period: 10,
            startY: 0,
          },
        },
        {
          type: "wave",
          params: {
            color: "white",
            amplitude: 2,
            period: 10,
            startY: 0,
            invert: true,
          },
        },
        {
          type: 'zoom',
          params: {
            zoomSpeed: 0.2
          }
        },
      ]
    }
  },
  {
    title: "neworld",
    src: "/beats/nwo.mp3",
    config: {
      backgroundColor: "white",
      nodes: [
        {
          type: "shape3d",
          params: {
            color: "blue",
            shape: "torus",
            amplitude: 0.02,
            startX: 0.5,
            startY: 0,
            startZ: -0.5,
            numOfShapes: 1,
          },
        },
        {
          type: "shape3d",
          params: {
            color: "red",
            shape: "torus",
            space: 0.8,
            amplitude: 0.01,
            startX: 0.5,
            rotateY: false,
            startY: 0,
            size: 0.5,
          },
        },
        {
          type: "shape3d",
          params: {
            color: "#00FF00",
            shape: "torus",
            space: 0.8,
            amplitude: 0,
            startX: 0.5,
            rotateZ: false,
            startY: 0,
            size: 0.1,
          },
        },
        {
          type: "zoom",
          params: {
            minZoom: 3,
            maxZoom: 8,
            zoomSpeed: 0.1,
          },
        },
      ],
    },
  },
  {
    title: "orkay",
    src: "/beats/orkay.mp3",
    config: {
      backgroundColor: "blue",
      nodes: [
        {
          type: "wave",
          params: {
            color: "red",
            amplitude: 1,
            period: 1,
            startY: 0,
          },
        },
        {
          type: "wave",
          params: {
            color: "red",
            amplitude: 1,
            period: 1,
            startY: 0,
            invert: true,
          },
        },
        {
          type: 'zoom',
          params: {
            zoomSpeed: 0.2
          }
        },
      ]
    }
  },
];

const useBeatStore = create<BeatStore>((set) => ({
  beats: beats,
  selectedBeat: beats[0],
  selectBeat: (beat) => set({ selectedBeat: beat }),
  nextBeat: () =>
    set((state) => {
      const index = state.beats.findIndex(
        (beat) => beat.title === state.selectedBeat.title
      );
      const nextIndex = (index + 1) % state.beats.length;
      return { selectedBeat: state.beats[nextIndex] };
    }),
  prevBeat: () =>
    set((state) => {
      const index = state.beats.findIndex(
        (beat) => beat.title === state.selectedBeat.title
      );
      const prevIndex =
        (index - 1 + state.beats.length) % state.beats.length;
      return { selectedBeat: state.beats[prevIndex] };
    }),
}));

export const useBeats = () => {
  return useBeatStore((state) => state);
};
