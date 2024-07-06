import React, {useState} from "react";
import Stats from "./Stats.tsx";
import './FlavorButton.css';
import BuildingDisplay from "./BuildingDisplay.tsx";

type FlavorView =
    | "stats"
    | "options"
    ;

/**
 * Flavor window used for displaying dynamic info
 */
export default function FlavorWindow() {
    const [flavorView, setFlavorView] = useState<FlavorView | null>(null);

    const closePanel = () => {
        setFlavorView(null);
    };

    const setFlavorFactory = (target: FlavorView) => {
        return () => {
            if (flavorView !== target) {
                setFlavorView(target);
            } else {
                setFlavorView(null);
            }
        };
    };

    return (
        <div className={"h-full bg-black flex flex-col"}>
            <div className={"flex flex-row h-28"}>
                <div className={"bg-gray-800 w-40 flex flex-col"}>
                    <button className={"w-full grow flavor-button bg-transparent drop-shadow-lg"}
                            onClick={setFlavorFactory("options")}>
                        Options
                    </button>
                    <button className={"w-full grow h-3/5 flavor-button bg-transparent"}
                            onClick={setFlavorFactory("stats")}>
                        Stats
                    </button>
                </div>
                <div className={"bg-gray-700 flex-grow"}>

                </div>
                <div className={"bg-gray-800 w-40"}>

                </div>
            </div>
            <div className={"grow flex flex-col"}>
                {flavorView === "stats" && <FlavorPanel onClose={closePanel}><Stats/></FlavorPanel>}
                {flavorView === null && <BuildingDisplay />}
            </div>
        </div>
    );
}

interface FlavorPanelProps {
    onClose: () => void;
    children: React.ReactNode;
}

function FlavorPanel(props: FlavorPanelProps) {
    const {onClose, children} = props;

    return (
        <div className={"relative grow"}>
            <button className={"w-10 h-10 absolute right-2 top-2 ring-1 ring-offset-1 ring-red-600 rounded-full bg-gray-900 text-red-700 text-2xl"} onClick={onClose}>X</button>
            {children}
        </div>
    );
}