import React from "react";
import {useGameContext} from "../../../game/Game.ts";
import {buildingTitle} from "../../../game/Building.ts";
import PaperclipQuantity from "../../common/PaperclipQuantity.tsx";

import {useUpdate} from "../../../common/useUpdate.ts";
import Tooltip from "../../common/Tooltip.tsx";
import {BuildingInfo} from "./BuildingInfo.tsx";
import PurchaseUpgrade from "./PurchaseUpgrade.tsx";

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
            [game, buildingId, quantity, mode, buildingCount, update]);
    const nextUpgrade = React.useMemo(() => {
        return Object.values(game.Upgrades)
            .filter(upgrade => !game.activeUpgrades.has(upgrade.id))
            .filter(upgrade => upgrade.associatedBuilding === buildingId)
            .sort((a, b) => (a.cost - b.cost))[0] || null;
    }, [game, buildingId, JSON.stringify(game.activeUpgrades)]);

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
        <div id={`${buildingId}-building`} className={"flex flex-row"}>
            <div id={`${buildingId}-building-buy-sell`}>
                <Tooltip anchorSelect={`.building-modal#${buildingId}-modal`}>
                    <BuildingInfo building={building} game={game} purchaseCount={quantity === "all" ? 100 : quantity}/>
                </Tooltip>
                <div
                    id={`${buildingId}-modal`}
                    className={"building-modal border-2 border-gray-200 hover:border-gray-500 cursor-pointer"}
                    onClick={onClick}
                >
                    <div className={"select-none bg-gray-800 border-gray-300 border-2"}>
                        <div
                            className={"relative h-24 w-80 items-start content-start text-justify text-xl font-bold italic"}
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
                                 src={new URL(building.storeIcon, import.meta.url).href}
                                 alt={`${buildingTitle(building)} icon`}/>
                        </div>
                    </div>
                </div>
            </div>
            <div id={`${buildingId}-building-upgrades`} className={"h-24 w-24 grid bg-black border-4 m-1"}>
                {nextUpgrade && <PurchaseUpgrade upgrade={nextUpgrade}/>}
            </div>
        </div>

    );
}

