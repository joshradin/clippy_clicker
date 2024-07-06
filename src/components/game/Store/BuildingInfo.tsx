import Building, {buildingTitle} from "../../../game/Building.ts";
import Game from "../../../game/Game.ts";
import React from "react";
import durationHumanizer from "../../../common/durationHumanizer.tsx";
import {titleCase} from "title-case";
import PaperclipQuantity from "../../common/PaperclipQuantity.tsx";


export function BuildingInfo({building, game, purchaseCount}: {
    building: Readonly<Building>,
    purchaseCount: number,
    game: Game
}) {
    const showInfo = React.useMemo(() => game.getBuildingCount(building.id) > 0, [building.id, game, game.lastUpdated]);
    const pcps = React.useMemo(() => game.getBuildingPcps(building.id) * game.getBuildingCount(building.id), [building.id, game, game.getBuildingCount(building.id), game.dataLastUpdated]);

    const purchaseTime = React.useMemo(() => {
            if (game.paperclips.perSecond === 0) return "∞";
            const rawSeconds = game.getBuildingCost(building.id) / game.paperclips.perSecond;
            return durationHumanizer(rawSeconds * 1000 /* ms conversion */);
        },
        [game.getBuildingCost(building.id), game.paperclips.perSecond]
    );

    const amortizationTime = React.useMemo(() => {
        const cost = game.getBuildingCost(building.id, purchaseCount);
        const pcps = game.getBuildingPcps(building.id);

        return durationHumanizer(cost / pcps * 1000);
    }, [game.getBuildingCost(building.id, purchaseCount), game.getBuildingPcps(building.id)]);


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
                    <li>
                        Approx. Amortization Time: {amortizationTime}
                    </li>
                </ul>
            </div>
            <p className={"italic font-light text-gray-400"}>{building.description}</p>
        </div>
    )
        ;
}