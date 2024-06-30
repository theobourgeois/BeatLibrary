export function SpinningRecord({
    outerColor = "black",
    innerColor = "white",
    onClick,
}: {
    onClick?: () => void;
    outerColor?: string;
    innerColor?: string;
}) {
    return (
        <div
            style={{
                background: outerColor,
                boxShadow: `inset 0 0 10px ${innerColor}, inset 2px 2px 0 #FFFFFF90`,
            }}
            onClick={onClick}
            id="record"
            className="relative cursor-pointer flex justify-center items-center w-full h-auto aspect-square rounded-full"
        >
            <div
                style={{
                    background: innerColor,
                }}
                className="w-1/4 h-1/4 rounded-full"
            ></div>
        </div>
    );
}
