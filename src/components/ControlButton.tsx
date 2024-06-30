import { useTheme } from "../utils/themes";

type ControlButtonProps = {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    showLight?: boolean;
    isLightOn?: boolean;
};

export function ControlButton({
    onClick,
    icon,
    label,
    showLight,
    isLightOn,
}: ControlButtonProps) {
    const theme = useTheme();

    return (
        <div className="space-y-2 font-semibold w-full flex items-center flex-col">
            <button
                onClick={onClick}
                style={{
                    background: `linear-gradient(180deg, ${theme.primaryLight} 0%, ${theme.primaryDark} 100%)`,
                    boxShadow: `inset 2px 2px 0 #FFFFFF80`,
                    borderColor: theme.gray,
                    outlineColor: theme.grayDark,
                }}
                className="outline-[5px] w-full outline h-8 justify-center border-2 flex items-center active:shadow-inner"
            >
                <div
                    style={{
                        color: theme.gray,
                    }}
                    className="scale-150"
                >
                    {icon}
                </div>
            </button>
            <div
                style={{
                    color: theme.text,
                }}
                className="text-center flex gap-2 items-center text-sm"
            >
                {showLight && (
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{
                            background: isLightOn
                                ? `linear-gradient(180deg, ${theme.accentLight} 0%, ${theme.accent} 100%)`
                                : theme.gray,
                            boxShadow: isLightOn
                                ? `0 0 10px ${theme.accent}`
                                : "none",
                        }}
                    ></div>
                )}
                {label}
            </div>
        </div>
    );
}
