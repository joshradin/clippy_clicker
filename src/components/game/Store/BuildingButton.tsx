import React from "react";
import Game, {useGameContext} from "../../../game/Game.ts";
import Building, {buildingTitle} from "../../../game/Building.ts";
import PaperclipQuantity from "../../common/PaperclipQuantity.tsx";

import {useUpdate} from "../../../common/useUpdate.ts";
import Tooltip from "../../common/Tooltip.tsx";
import {titleCase} from "title-case";
import durationHumanizer from "../../../common/durationHumanizer";

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

export default function BuildingButton(
    {
        buildingId,
        mode,
        quantity
    }: BuildingButtonProps
) {
    const update = useUpdate();
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
            [game, buildingId, quantity, mode, buildingCount, update])
    ;

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
            <Tooltip anchorSelect={`.building-modal#${buildingId}-modal`}>
                <BuildingInfo building={building} game={game}/>
            </Tooltip>
            <div
                id={`${buildingId}-modal`}
                className={"building-modal border-2 border-gray-200 hover:border-gray-500 cursor-pointer"}
                onClick={onClick}
            >
                <div className={"select-none bg-gray-800 border-gray-300 border-2"}>
                    <div
                        className={"relative ont-mono h-24 w-80 items-start content-start text-justify text-xl font-bold italic"}
                    >
                        <div
                            className={`absolute left-0 top-0 pl-2 pt-2 ${canDoAction ? 'text-white' : 'text-red-700 line-through'}`}>
                            <h2>{buildingTitle(building)}</h2>
                        </div>
                        <div className={"absolute right-0 bottom-0 pr-2 pt-2 text-sky-200"}>
                            {mode === "buy" &&
                                <PaperclipQuantity quantity={game.getBuildingCost(buildingId, quantity)}/>}
                        </div>
                        <div className={"text-6xl absolute top-2 right-0 pr-2 text-white"}>
                            {buildingsOwned}
                        </div>
                        <img draggable={false}
                             className={"absolute bottom-0 left-0 float-right rotate-12 pl-2 pb-2 h-2/3 " + (canDoAction ? "grayscale-0" : "grayscale")}
                             src={new URL(building.bigIcon, import.meta.url).href}
                             alt={`${buildingTitle(building)} icon`}/>
                    </div>
                </div>
            </div>

        </>

    );
}

export function BuildingInfo({building, game}: {
    building: Readonly<Building>,
    game: Game
}) {
    const showInfo = React.useMemo(() => game.getBuildingCount(building.id) > 0, [building.id, game, game.lastUpdated]);
    const pcps = React.useMemo(() => game.getBuildingPcps(building.id) * game.getBuildingCount(building.id), [building.id, game, game.getBuildingCount(building.id), game.dataLastUpdated]);

    const purchaseTime = React.useMemo(() => {
            if (game.paperclips.perSecond === 0) return "∞";
            const rawSeconds = game.getBuildingCost(building.id) / game.paperclips.perSecond;
            return durationHumanizer(rawSeconds * 1000 /* ms conversion */);
        },
        [game.getBuildingCost(building.id), game.paperclips.perSecond, game.dataLastUpdated]
    );


    return (
        <div className={"divide-y divide-slate-600"}>
            <div className={"text-white text-sm text-start pb-2"}>
                <h2 className={"font-bold"}>{buildingTitle(building)}</h2>
                <ul
                    className={"pl-4"}
                    style={{
                        listStyle: 'inside "📎 "',
                    }}>
                    {showInfo &&
                        <>
                            <li>
                                Per Second: {pcps.toPrecision(3)} ({(pcps / game.paperclips.perSecond * 100).toFixed(1)}%
                                of
                                total)
                            </li>

                        </>
                    }
                    <li>
                        Each {titleCase(building.id)} provides <PaperclipQuantity
                        quantity={game.getBuildingPcps(building.id)}/> /sec
                    </li>
                    <li>
                        Approx. Purchase Time: {purchaseTime}
                    </li>
                </ul>
            </div>
            <p className={"italic font-light text-gray-400"}>{building.description}</p>
        </div>
    )
        ;
}