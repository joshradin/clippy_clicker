import {useGameContext} from "../../../game/Game.ts";
import HumanReadableQuantity from "../../common/HumanReadableQuantity.tsx";
import React from "react";
import UpgradeIcon from "../../common/UpgradeIcon.tsx";
import {UpgradeTooltip} from "../UpgradeTooltip.tsx";
import {sortUpgrades} from "../../../game/upgrades.ts";

export default function Stats() {
    const game = useGameContext();
    const upgrades = React.useMemo(() => {
        return sortUpgrades([...game.activeUpgrades]
            .map(upgradeId => game.Upgrades[upgradeId]));
    }, [game, JSON.stringify(game.activeUpgrades), game.dataLastUpdated]);

    return (
        <div className={"container flex flex-col place-items-center bg-gray-950 text-white h-full"}>
            <section className={"w-full px-5"}>
                <header className={"text-center text-xl"}>
                    <h2>Stats</h2>
                </header>
                <p>
                    <span className={"font-bold"}>Total Paperclips: </span>
                    <span><HumanReadableQuantity quantity={Math.floor(game.paperclips.thisAscension.total)}/></span>
                </p>
                <p>
                    <span className={"font-bold"}>Per Click: </span>
                    <span>{game.paperclips.perClick}</span>
                </p>
                <p>
                    <span className={"font-bold"}>Build Time: </span>
                    <span>{(game.buildTime / 1000).toPrecision(3)} sec.</span>
                </p>
                <p>
                    <span className={"font-bold"}>Total Buildings: </span>
                    <span>{game.totalBuildings}</span>
                </p>

            </section>
            <section className={"w-full px-5"}>
                <header className={"text-center text-xl"}>
                    <h2>Upgrades</h2>
                </header>
                <div className={"container flex flex-row flex-wrap gap-1"}>
                    {
                        upgrades.map(upgrade => {
                            return (
                                <div key={upgrade.id}>
                                    <UpgradeTooltip upgrade={upgrade}/>
                                    <div id={`upgrade-${upgrade.id}`}>
                                        <UpgradeIcon size={"small"} icon={upgrade.icon!} effect={upgrade.effect}/>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </section>
        </div>
    );
}