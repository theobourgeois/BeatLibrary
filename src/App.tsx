import { Border } from "./components/Border";
import { ControlButton } from "./components/ControlButton";
import { LeftScreen } from "./components/LeftScreen";
import { RightScreen } from "./components/RightScreen";
import { useTheme } from "./utils/themes";
import { IoPlaySharp } from "react-icons/io5";
import { IoStop } from "react-icons/io5";
import { IoMdRewind } from "react-icons/io";
import { IoIosFastforward } from "react-icons/io";
import { usePlayback } from "./store/playback";
import { useBeats } from "./store/beats";
import { Knob } from "./components/Knob";

function App() {
    const theme = useTheme();
    const { volume, setVolume, isPlaying, togglePlay, stop } = usePlayback();
    const { nextBeat, prevBeat } = useBeats();

    return (
        <div
            className="w-screen h-screen flex justify-center items-center"
            style={{
                background: `linear-gradient(180deg, ${theme.primaryDark} 0%, ${theme.primary} 100%)`,
            }}
        >
            <div
                style={{
                    color: theme.text,
                }}
                className="absolute m-2 top-0 left-0 flex items-center gap-2"
            >
                <p>
                    Contact me to buy any beats via{" "}
                    <a
                        className="text-blue-500"
                        href="mailto:theoobourgeois@gmail.com"
                    >
                        email
                    </a>{" "}
                    or{" "}
                    <a
                        className="text-blue-500"
                        href="https://x.com/_theobourgeois"
                    >
                        twitter
                    </a>
                </p>
            </div>
            <div
                className="w-11/12 h-max px-8 py-4 flex flex-col gap-4"
                style={{
                    background: `linear-gradient(180deg, ${theme.primaryLight} 0%, ${theme.primaryDark} 100%)`,
                    boxShadow: `inset 0 -4px 5px #00000050, inset 3px 2px 1px #FFFFFF90, 0 10px 10px #00000020`,
                }}
            >
                <div>
                    <h1
                        className="font-bold text-xl flex items-center gap-4"
                        style={{
                            fontFamily: "Lexend Zetta",
                            color: theme.text,
                        }}
                    >
                        théo beats{" "}
                        <span className="text-sm font-normal">
                            beat library and audio visualizer
                        </span>
                    </h1>
                </div>
                <div className="flex flex-col md:flex-row flex-grow h-[80%] gap-8">
                    <div className="w-full md:w-[30%] h-full space-y-3">
                        <Border>
                            <LeftScreen />
                        </Border>
                        <div className="mx-4 flex-grow flex justify-center gap-2">
                            <ControlButton
                                onClick={prevBeat}
                                icon={<IoMdRewind />}
                                label="PREV"
                            ></ControlButton>
                            <ControlButton
                                onClick={stop}
                                icon={<IoStop />}
                                label="STOP"
                            ></ControlButton>
                            <ControlButton
                                onClick={togglePlay}
                                icon={<IoPlaySharp />}
                                isLightOn={isPlaying}
                                showLight
                                label="PLAY"
                            ></ControlButton>
                            <ControlButton
                                onClick={nextBeat}
                                icon={<IoIosFastforward />}
                                label="NEXT"
                            ></ControlButton>
                        </div>
                    </div>
                    <div className="w-full md:w-[70%] h-full space-y-2">
                        <Border>
                            <RightScreen />
                        </Border>
                        <div className="flex gap-4 justify-end items-center">
                            <Knob value={volume} onChange={setVolume} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
