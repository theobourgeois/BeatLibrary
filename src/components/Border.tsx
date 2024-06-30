import { useTheme } from "../utils/themes";

export function Border({ children }: { children: React.ReactNode }) {
    const theme = useTheme();

    return (
        <div
            className="w-full h-[300px] md:h-[600px] p-4 flex justify-center"
            style={{
                background: `linear-gradient(180deg, ${theme.primaryLight} 0%, ${theme.primaryDark} 100%)`,
                boxShadow: `inset 0 -4px 7px #00000050, inset 4px 2px 1px #FFFFFF80`,
            }}
        >
            {children}
        </div>
    );
}
