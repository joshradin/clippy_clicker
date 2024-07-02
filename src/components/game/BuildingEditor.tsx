import React, {useState} from "react";
import Game, {useGameContext} from "../../game/Game.ts";
import Building from "../../game/Building.ts";
import PaperclipCost from "../common/PaperclipCost.tsx";
import {useUpdate} from "../../common/update.tsx";

interface IBuildingEditorProps {
    buildingId: string,
    mode: "buy" | "sell",
    quantity: number | "all"
}

interface BuyBuildingButtonProps extends IBuildingEditorProps {
    buildingId: string,
    mode: "buy";
    quantity: number
}


interface SellBuildingButtonProps extends IBuildingEditorProps {
    buildingId: string,
    mode: "sell";
    quantity: number | "all"
}

export type BuildingButtonProps = BuyBuildingButtonProps | SellBuildingButtonProps;

export default function BuildingEditor(
    {
        buildingId,
        mode,
        quantity
    }: BuildingButtonProps
) {
    useUpdate();
    const game = useGameContext();
    const building = React.useMemo(() => {
        return game.Buildings[buildingId];
    }, [game, buildingId]);
    const buildingCount = game.getBuildingCount(buildingId);
    const buildingsOwned = React.useMemo(() => {
        return buildingCount;
    }, [buildingCount]);
    const canDoAction =
        React.useMemo(() => {
                console.log("checking if can", mode, "for building", buildingId);
                switch (mode) {
                    case "buy": {
                        return game.canPurchase(game.getBuildingCost(buildingId, quantity));
                    }
                    case "sell": {
                        switch (quantity) {
                            case "all":
                                return buildingCount > 0;
                            default:
                                return buildingCount >= quantity;
                        }
                    }
                }
            },
            [game, buildingId, quantity, mode, buildingCount, game.paperclips.current])
    ;

    const [hover, setHover] = useState(false);

    const onClick = () => {
        switch (mode) {
            case "buy": {
                if (canDoAction) {
                    if (!game.buy({
                        id: buildingId, kind: "building", quantity
                    })) {
                        console.error("failed to buy", quantity, buildingId);
                    }
                }
                return;
            }
        }
    };


    return (
        <>
            <div className={"border-2 border-gray-200 hover:border-gray-500"}
                 onMouseEnter={() => {
                     setHover(true);
                 }}
                 onMouseLeave={() => {
                     setHover(false);
                 }}
                 onClick={onClick}
            >
                {<BuildingEditorHover show={hover} building={building} game={game}/>}
                <div className={"select-none bg-gray-800 border-gray-300 border-2"}>
                    <div
                        className={"relative ont-mono h-28 w-56 items-start content-start text-justify text-xl font-bold italic"}>
                        <div>
                            <span
                                className={`absolute left-0 top-0 pl-2 pt-2 ${canDoAction ? 'text-white' : 'text-red-700 line-through'}`}>
                                <h2>{building.id}</h2>
                             </span>
                        </div>
                        <span className={"absolute right-0 bottom-0 pr-2 pt-2 text-sky-200"}>
                            <PaperclipCost cost={game.getBuildingCost(buildingId)}/>
                        </span>
                        <span className={"text-6xl absolute top-2 right-0 pr-2 text-white"}>
                            {buildingsOwned}
                        </span>
                    </div>
                </div>
            </div>
        </>

    );
}

export function BuildingEditorHover({show, building}: { show: boolean, building: Readonly<Building>, game: Game }) {
    return (
        <div role={"tooltip"}
             className={`z-10 place-items-start absolute bg-black ${show ? "visible" : "invisible"} transition-opacity duration-1000`}>
            <span className={"text-white text-sm text-start"}>
                <span className={"font-bold"}>{building.description}</span>
            </span>
        </div>
    );
}
