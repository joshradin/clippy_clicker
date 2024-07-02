import React from "react";
import {UpdateContext} from "./update.tsx";

/**
 * Allows for using updates
 */
export function useUpdate(): number {
    const tick = React.useRef<number>();
    const update = React.useContext(UpdateContext);
    if (tick.current != update) {
        tick.current = update;
    }
    return tick.current;
}