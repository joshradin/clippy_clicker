import React, {ReactNode} from 'react';

export const UpdateContext = React.createContext(0);

/**
 * Update provider
 * @param children children nodes that can receive update ticks
 * @param interval the interval in which updates are issued. An interval of 0 means run immediately
 * @constructor
 */
export function UpdateProvider({children, interval = 0}: {children: ReactNode, interval?: number}) {
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => {
        const intervalHandle = setInterval(() => {
            setTick(tick + 1);
        }, interval);

        return () => clearInterval(intervalHandle);
    }, [tick, interval]);

    return (
        <UpdateContext.Provider value={tick}>
            { children }
        </UpdateContext.Provider>
    );
}

