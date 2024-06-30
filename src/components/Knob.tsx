import { Theme, useTheme } from "../utils/themes";

function snapTo(
    value: number,
    step: number,
    option: "floor" | "ceil" | "round" = "round"
) {
    if (option === "floor") {
        return Math.floor(value / step) * step;
    }
    if (option === "round") {
        return Math.round(value / step) * step;
    }

    return Math.ceil(value / step) * step;
}

const KNOB_SIZE = 60;

const getStyles = (theme: Theme): Record<string, React.CSSProperties> => ({
    background: {
        backgroundColor: theme.primary,
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        padding: "5px",
        zIndex: 2,
        borderRadius: "50%",
        boxShadow:
            "inset 0 -2px 3px 0 rgba(0, 0, 0, 0.4), 0 10px 10px -4px rgba(0, 0, 0, 0.2)",
    },
    foreground: {
        backgroundColor: theme.accent,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        position: "relative",
    },
    notch: {
        backgroundColor: theme.primary,
        width: 6,
        height: 14,
        position: "absolute",
        left: "42%",
        top: 0,
    },
});

export type KnobProps = {
    value: number;
    onChange: (value: number) => void;
};

const MAX = 1;
const MIN = 0;
const STEP = 0.01;

export function Knob({ value, onChange }: KnobProps) {
    const theme = useTheme();
    const styles = getStyles(theme);

    const getRotation = () => {
        const ratio = value / MAX;
        const rotation = 135 * 2 * ratio - 135;
        return `rotate(${rotation}deg)`;
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const startY = e.clientY; // Record the starting Y position

        const handleMouseMove = (e: MouseEvent) => {
            const sensitivity = 0.5; // Adjust this factor to control sensitivity
            const movementY = -1 * (e.clientY - startY);
            const newValue = value + movementY * STEP * sensitivity;
            const clampedValue = snapTo(
                Math.max(MIN, Math.min(MAX, newValue)),
                STEP,
                "floor"
            );

            if (clampedValue !== value) {
                onChange(clampedValue);
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div
            className="relative"
            style={{
                width: KNOB_SIZE,
                height: KNOB_SIZE,
            }}
        >
            <div
                className="absolute flex items-center justify-center"
                onMouseDown={handleMouseDown}
                style={styles.background}
            >
                <div
                    style={{
                        ...styles.foreground,
                        transform: getRotation(),
                    }}
                >
                    <div style={styles.notch}></div>
                </div>
            </div>
        </div>
    );
}
