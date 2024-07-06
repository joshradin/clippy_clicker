import {Tooltip as ReactTooltip} from "react-tooltip";
import React, {ReactNode} from "react";

export interface TooltipProps {
    anchorSelect: string;
    children: ReactNode;
}

export default function Tooltip({anchorSelect, children}: TooltipProps): ReactNode {
    const ref = React.createRef<HTMLDivElement>();

    return (
        <ReactTooltip anchorSelect={anchorSelect}
                      noArrow={true}
                      opacity={1.0}
                      delayShow={250}
                      style={{
                          zIndex: 9999,
                          backgroundColor: "transparent"
                      }}
        >
            <div ref={ref} data-tooltip-id={ref.current?.id}>
                <div
                    className={`place-items-start bg-gray-900 p-1 border-2 border-indigo-500 rounded max-w-80`}>
                    {children}
                </div>
            </div>
        </ReactTooltip>
    );
}