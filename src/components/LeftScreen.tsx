import { Beat, useBeats } from "../store/beats";
import { useTheme } from "../utils/themes";

export function LeftScreen() {
    const theme = useTheme();
    const { beats, selectBeat, selectedBeat, nextBeat, prevBeat } = useBeats();

    const handleSelectBeat = (beat: Beat) => () => {
        selectBeat(beat);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        const isDownArrow = e.key === "ArrowDown";
        const isUpArrow = e.key === "ArrowUp";

        if (!isDownArrow && !isUpArrow) return;

        if (isDownArrow) {
            nextBeat();
        } else {
            prevBeat();
        }
    };

    return (
        <div
            tabIndex={0}
            style={{
                borderColor: theme.grayDark,
            }}
            onKeyDown={handleKeyDown}
            className="w-full border-4 h-full overflow-y-auto flex flex-col bg-white outline-0"
        >
            {beats.map((beat) => (
                <div
                    key={beat.title}
                    className="py-2 px-4 cursor-pointer font-bold"
                    onClick={handleSelectBeat(beat)}
                    style={{
                        fontFamily: "Almarai",
                        background:
                            selectedBeat.title === beat.title
                                ? `linear-gradient(180deg, ${theme.accentLight} 0%, ${theme.accent} 100%)`
                                : "none",
                        color:
                            selectedBeat.title === beat.title
                                ? theme.textLight
                                : theme.text,
                    }}
                >
                    {beat.title}
                </div>
            ))}
        </div>
    );
}
