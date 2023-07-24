import { CSSProperties, ReactNode } from "react";

const LocatedModal = ({
    x = 0,
    y = 0,
    className = "",
    style,
    children,
}: {
    x?: number;
    y?: number;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}): JSX.Element => {
    return (
        <div
            className={`absolute ${className}`}
            style={{
                ...style,
                left: x,
                top: y,
            }}
        >
            {children}
        </div>
    );
};

export default LocatedModal;
