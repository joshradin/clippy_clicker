import Modifier from "./Modifier.ts";
import UnlockCriteria from "./UnlockCriteria.ts";
import findUpgrades, {verifyUpgrades} from "./upgrades.ts";
import {UpgradeIconEffect} from "../components/common/UpgradeIcon.tsx";
import Game from "./Game.ts";

/**
 * An upgrade
 */
export default interface Upgrade {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly icon?: string;
    readonly effect?: UpgradeIconEffect;
    readonly cost: number;
    readonly criteria: UnlockCriteria;
    readonly modifiers: ReadonlyArray<Modifier>;
}

/**
 * Loads all upgrades, providing an association from id to the upgrade itself
 */
export function loadUpgrades(game: Game): Record<number, Upgrade> {
    const upgrades: Upgrade[] = findUpgrades(game);
    verifyUpgrades(upgrades);
    return upgrades.reduce((accum, upgrade) => {
        accum[upgrade.id] = upgrade;
        return accum;
    }, {} as Record<number, Upgrade>);
}