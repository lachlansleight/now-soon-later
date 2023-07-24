import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

export type ExpandingButtonOption = {
    icon: JSX.Element;
    label: string;
    id: string;
};
const ExpandingButton = ({
    options,
    onClick,
    buttonSize = 48,
    buttonSpacing = 24,
    spreadAngle = 180,
}: {
    options: ExpandingButtonOption[];
    onClick: (id: string) => void;
    buttonSize?: number;
    buttonSpacing?: number;
    spreadAngle?: number;
}): JSX.Element => {
    const [open, setOpen] = useState(false);

    const radialSpacing = useMemo(() => {
        const circumference = buttonSize * options.length + buttonSpacing * (options.length - 1);
        const radius = circumference / ((spreadAngle * Math.PI) / 180);
        return Math.max(radius - buttonSize, buttonSize + buttonSpacing);
    }, [options, buttonSize, buttonSpacing, spreadAngle]);

    const openPositions = useMemo(() => {
        const positions: number[][] = [];
        let angle = spreadAngle * 0.5 + 90;
        const angleIncrement = spreadAngle / (options.length - 1);
        const radius = radialSpacing;
        for (let i = 0; i < options.length; i++) {
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            positions.push([x, y]);
            angle -= angleIncrement;
        }
        return positions;
    }, [options, radialSpacing, spreadAngle]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.stopPropagation();
        setOpen(false);
        onClick(id);
    };

    // if(!open) {
    //     return (
    //         <div
    //             className="fixed bottom-0 grid place-items-center pointer-events-none pb-4"
    //             style={{
    //                 width: `calc(100vw - 0.5rem)`,
    //             }}
    //         >
    //             <button
    //                 className="bg-primary-600 grid place-items-center rounded-full shadow-md cursor-pointer text-2xl pointer-events-auto"
    //                 style={{
    //                     width: buttonSize,
    //                     height: buttonSize,
    //                 }}
    //                 onClick={() => setOpen(true)}
    //             >
    //                 <FaPlus />
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <div
            className={`fixed top-0 left-0 w-screen h-screen bg-black ${
                open ? "bg-opacity-20" : "bg-opacity-0"
            } transition-all ${open ? "" : "pointer-events-none"}`}
            onClick={open ? () => setOpen(false) : undefined}
        >
            <div className="fixed bottom-0 grid place-items-center pointer-events-none pb-4 w-full">
                <div className="absolute bottom-0 grid place-items-center pointer-events-none pb-4 w-full left-1">
                    <div
                        className="relative"
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                        }}
                    >
                        {options.map((option, i) => {
                            const position = openPositions[i];
                            return (
                                <button
                                    key={option.id}
                                    className="absolute bg-primary-600 grid place-items-center rounded-full shadow-md cursor-pointer text-2xl pointer-events-auto"
                                    style={{
                                        width: buttonSize,
                                        height: buttonSize,
                                        left: open ? position[0] : 0,
                                        bottom: open ? position[1] : 0,
                                        transition: "all 0.15s",
                                    }}
                                    onClick={e => handleClick(e, option.id)}
                                >
                                    {option.icon}
                                    <span
                                        className={`absolute text-center text-xs w-24 -top-5 text-white ${
                                            open ? "text-opacity-100" : "text-opacity-0"
                                        }`}
                                        style={{
                                            transition: "all 0.1s",
                                        }}
                                    >
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <button
                        className="absolute bg-primary-600 grid place-items-center rounded-full shadow-md cursor-pointer text-2xl pointer-events-auto"
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            bottom: "16px",
                            transition: "all 0.15s",
                            transform: open ? "rotate(45deg)" : "",
                        }}
                        onClick={() => setOpen(!open)}
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpandingButton;
