import {
    AudioVisualizer,
    AudioVisualizerConfig,
} from "../audio-visualizer/AudioVisualizer";
import { useBeats } from "../store/beats";
import { usePlayback } from "../store/playback";
import { useTheme } from "../utils/themes";
import { SpinningRecord } from "./SpinningRecord";

const defaultConfig: AudioVisualizerConfig = {
    nodes: [
        {
            type: "wave",
            params: {
                fillUnder: true,
                color: "red",
                amplitude: 1,
                period: 10,
                startY: 0,
                thickness: 100,
            },
        },
    ],
};

export function RightScreen() {
    const { selectedBeat, nextBeat } = useBeats();
    const { isPlaying, volume, togglePlay } = usePlayback();
    const theme = useTheme();

    return (
        <div
            style={{
                borderColor: theme.grayDark,
            }}
            onClick={togglePlay}
            className="bg-black relative w-full border-4"
        >
            {!isPlaying && (
                <div className="flex w-full h-full items-center justify-center absolute">
                    <div className="relative w-1/2 h-1/2 items-center justify-center flex opacity-45">
                        <SpinningRecord />
                    </div>
                </div>
            )}
            <AudioVisualizer
                onNextTrack={nextBeat}
                volume={volume}
                src={selectedBeat.src}
                isPlaying={isPlaying}
                config={selectedBeat.config || defaultConfig}
            />
        </div>
    );
}
