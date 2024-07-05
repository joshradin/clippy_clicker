import Modifier from "./Modifier.ts";
import UnlockCriteria from "./UnlockCriteria.ts";
import rawUpgrades from "./upgrades.json";
import {UpgradeIconEffect} from "../components/common/UpgradeIcon.tsx";

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
export function loadUpgrades(): Record<number, Upgrade> {
    const upgrades: Upgrade[] = rawUpgrades as Upgrade[];
    return upgrades.reduce((accum, upgrade) => {
        accum[upgrade.id] = upgrade;
        return accum;
    }, {} as Record<number, Upgrade>);
}